/*HTMLから呼ばれる部分*/
function jumpViewTv(sid, channel, name) {
    var query = document.location.search.substring(1);
    var parameters = query.split('&');
    var query = {};
    for (var i = 0; i < parameters.length; i++) {
        var element = parameters[i].split('=');
        query[decodeURIComponent(element[0])] = decodeURIComponent(decodeURIComponent(element[1]));
    }

    $("#sid").html('<input type="hidden" name="sid" value='+ sid + ' id="sid">');
    $("#channel").html('<input type="hidden" name="channel" value=' + channel + ' id="channel">');
    if(typeof query.ch == "undefined") {
        $("#channelName").html('<input type="hidden" name="channelName" value=' + name + ' id="channelName">');
        $("#jumpDialogChannelName").text(name);
    }

    notifyReceiveChangeChannelConfig(query["type"]);

    //チューナ情報取得を依頼
    function notifyReceiveChangeChannelConfig(type) {
        socketio.emit("getJumpChannelConfig", socketid, type);
    }
}

//ストリーム開始をサーバーに依頼
function notifyJumpChannel() {
    document.new_stream_form.submit();
}

//socketio 受信関係
(function () {
    //チューナーリストを取得
    socketio.on("resultJumpChannelList", function (data) {
        if(data.socketid != socketid) { return; }

        if(data.tunerList.length == 0) {
            $.growl.error({ message: "チューナーの空きがありません" });
            $("#jumpViewTvDialog").popup('close');
            return;
        }

        //ダイアログの準備
        var tunerSelectStr = "";
        for(var i = 0; i < data.tunerList.length; i++) {
            tunerSelectStr += `<option value="${data.tunerList[i].id}">${data.tunerList[i].name}</option>`;
        }

        var videoConfigStr = "";
        for(var i = 0; i < data.videoConfig.length; i++) {
            videoConfigStr += `<option value="${data.videoConfig[i].id}">${data.videoConfig[i].size}</option>`;
        }

        //video selectを更新
        $("#jumpVideoSize").empty();
        $("#jumpVideoSize").append(videoConfigStr);
        $("#jumpVideoSize").val(data.videoConfig[0].id);
        $("#jumpVideoSize").selectmenu('refresh',true);

        //tuner selectを更新
        $("#jumpTuner").empty();
        $("#jumpTuner").append(tunerSelectStr);
        $("#jumpTuner").val(data.tunerList[0].id);
        $("#jumpTuner").selectmenu('refresh',true);

        //ダイアログオープン
        $("#jumpViewTvDialogButton").click();
    });

    //チューナー設定のリロード
    socketio.on("changeStreamStatus", function (data) {
        if($("#jumpViewTvDialog-popup").attr('class').indexOf("ui-popup-active") != -1) {
            notifyReceiveChangeChannelConfig(getQuery().type);
        }
    });
})();

