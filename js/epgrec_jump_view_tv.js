var tmpSid, tmpChannel, tmpName;

socketio.on("resultJumpChannelList", function (data) { resultJumpChannelList(data) }); //viewtvへ飛ぶためのチューナーリスト

//ストリーム開始をサーバーに依頼
function notifyJumpChannel() {
    $("#sid").html('<input type="hidden" name="sid" value='+ tmpSid + ' id="sid">');
    $("#channel").html('<input type="hidden" name="channel" value=' + tmpChannel + ' id="channel">');
    $("#channelName").html('<input type="hidden" name="channelName" value=' + tmpName + ' id="channelName">');
    document.new_stream_form.submit();
}

//チューナーリストを取得
function resultJumpChannelList(data) {
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

    //チャンネル名書き換え
    $("#jumpDialogChannelName").text(tmpName);

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
}

//チューナ情報取得を依頼
function notifyReceiveChangeChannelConfig(type) {
    socketio.emit("getJumpChannelConfig", socketid, type);
}

function jumpViewTv(sid, channel, name) {
    var query = document.location.search.substring(1);
    var parameters = query.split('&');
    var query = {};
    for (var i = 0; i < parameters.length; i++) {
        var element = parameters[i].split('=');
        query[decodeURIComponent(element[0])] = decodeURIComponent(decodeURIComponent(element[1]));
    }

    tmpSid = sid;
    tmpChannel = channel;
    tmpName = name;
    notifyReceiveChangeChannelConfig(query["type"]);
}

//チューナー設定のリロード
socketio.on("changeStreamStatus", function (data) {
    if($("#jumpViewTvDialog-popup").attr('class').indexOf("ui-popup-active") != -1) {
        notifyReceiveChangeChannelConfig(getQuery().type);
    }
});

