/*swipe_page.js から呼ばれる*/
var nextTimeCount = 0;
var viewTvUpdateTvProgramTimer;
function swipeBackPage() {
    nextTimeCount = 0;
    clearInterval(viewTvUpdateTvProgramTimer);
    getTvProgramList();
}

function swipeNextPage() {
    nextTimeCount += 10;
    clearInterval(viewTvUpdateTvProgramTimer);
    getTvProgramList();
}

/*HTM から呼ばれる*/
//サーバへストリームの停止を依頼
function notiyStopStream() {
    socketio.emit("clientStopStream", getStreamNumber());
}

//チャンネル変更ダイアログをオープン
function notifyReceiveChangeChannelConfig(type, sid, channel, name) {
    socketio.emit("getChangeChannelConfig", socketid, getStreamNumber(), type);
    $("#dialogType").val(type);
    $("#dialogChannelName").text(name); //チャンネル名書き換え
    $("#sid").val(sid);
    $("#channel").val(channel);
    $("#linkChangeChannelDialog").click(); //ダイアログオープン
}

//チャンネル変更をサーバに依頼
function notifyChangeChannel() {
    if($("#changeTuner").children().length == 0) { return; } //チューナーが無いとき
    if(typeof $("#tunerId").val() != "undefined" && $("#tunerId").val() == $("#changeTuner").children(':selected').val()) {
        socketio.emit("changeChannel", getStreamNumber(), $("#dialogChannelName").text(), $("#sid").val(), $("#channel").val(), $("#changeTuner").children(':selected').val(), $("#changeVideoSize").children(':selected').val());
    } else {
        $("#channelName").html('<input type="hidden" name="channelName" value=' + $("#dialogChannelName").text() + ' id="channelName">');
        document.new_stream_form.submit();
    }
}

/*viewtv.js内で呼ばれる部分*/
var tabType;
function getTvProgramList() { socketio.emit("getTvProgramList", socketid, tabType, nextTimeCount); }
function getStreamNumber() {  return $("#streamNumber").val(); }

$(document).ready(function(){
    if(window.location.search.length == 0){
        if(getStreamNumber() =="undefined") {
            location.href='/';
        } else {
            location.href='/viewtv?num=' + getStreamNumber();
        }
    }
});

/*タブ*/
$(function () {
    $(".tabs a").on('click', function(element) {
        tabType = element.target.id.substr(0, 2);
        nextTimeCount = 0;

        $('.tab', $(this).closest('.tabs')).removeClass('active');
        $(this).closest('.tab').addClass('active');

        clearInterval(viewTvUpdateTvProgramTimer);
        getTvProgramList();
    });
    $("#GR_tab").click();
    setTimeout(function() { getTvProgram() }, 500);

    //番組情報の取得をサーバに依頼する
    function getTvProgram() {
        socketio.emit("getTvProgram", getStreamNumber());
    }

    /*socketio 受信関係*/
    //loading gif
    var tmpStreamHash;
    socketio.on("enableStream", function (data) {
        if(getStreamNumber() == data.streamNumber) {
            $("#loading").fadeOut();
            $("#container").fadeIn();
            $("#videoPlayer").get(0).play();
        }
        //他のストリーム情報を更新
        tmpStreamHash = data.streamHash;
        updateOtherStreamInfo();
    });

    /*配信停止関係*/
    //server側のエラーで配信停止時
    socketio.on("errorStream", function errorStream(data) {
        if(getStreamNumber() == data.value) {
            location.href = "/viewtv_error";
        } else {
            if(typeof tmpStreamHash != "undefined") { delete tmpStreamHash[data.value]; }
            updateOtherStreamInfo();
        }
    });

    //正常に配信停止
    socketio.on("stopStream", function (streamNumber) {
        if(getStreamNumber() == streamNumber) {
            location.href = "/";
        } else {
            if(typeof tmpStreamHash != "undefined") { delete tmpStreamHash[streamNumber]; }
            updateOtherStreamInfo();
        }
    });

    /*チャンネル変更関係*/
    //チャンネル変更ができたことの通知
    socketio.on("reloadChangeChannel", function (data) {
        if(data.streamNumber == getStreamNumber()) { location.reload(); }
    });

    //チャンネル変更のためのチューナーリスト
    socketio.on("resultChangeChannelList", function (data) {
        if(data.socketid != socketid) { return; }
        updateTunerList(data);

        function updateTunerList(data) {
            //ダイアログの準備
            var tunerSelectStr = "";
            var tunerIndex = 0;

            for(var i = 0; i < data.tunerList.length; i++) {
                if(data.tunerList[i].id == data.tunerId) {
                    tunerIndex = i;
                    $("#tunerId").val(data.tunerId);
                    tunerSelectStr += `<option value="${data.tunerList[i].id}">チャンネル変更</option>`;
                } else {
                    tunerSelectStr += `<option value="${data.tunerList[i].id}">${data.tunerList[i].name}</option>`;
                }
            }

            var videoConfigStr = "";
            for(var i=0; i < data.videoConfig.length; i++) {
                videoConfigStr += `<option value="${data.videoConfig[i].id}">${data.videoConfig[i].size}</option>`;
            }

            //video selectを更新
            $("#changeVideoSize").empty();
            $("#changeVideoSize").append(videoConfigStr);
            $("#changeVideoSize").val(data.videoConfig[0].id);
            $("#changeVideoSize").selectmenu('refresh',true);

            //tuner selectを更新
            $("#changeTuner").empty();
            $("#changeTuner").append(tunerSelectStr);
            $("#changeTuner").val(data.tunerList[tunerIndex].id);
            $("#changeTuner").selectmenu('refresh',true);
        }
    });

    /*番組表関係*/
    //番組表のリスト更新
    socketio.on("resultTvProgramList", function (data) {
        if(data.id != socketid) { return; }
        //listの中身を削除
        $('#program_list').empty();

        var programStr = "";
        if(data.value.length == 0) {
            programStr += "<li>番組表情報が取得できませんでした。</li>"
        } else {
            var minTimer = 6048000000;
            var nowDate = new Date().getTime();
            for(var i = 0; i < data.value.length; i++) {
                var result = data.value[i];
                programStr += `<li><a href="javascript:notifyReceiveChangeChannelConfig('${result["type"]}', '${result["sid"]}', '${result["channel"]}', '${result["name"]}')">`
                programStr += `<h3>${result["name"]}</h3>`
                programStr += `<p>${getFormatedDate(result["starttime"])} ~ ${getFormatedDate(result["endtime"])}</p>`
                programStr += `<p>${result["title"]}</p>`
                programStr += `<p class="wordbreak">${result["description"]}</p>`
                programStr += `</a></li>\n`;

                var subDate = new Date(result["endtime"]).getTime() - nowDate;
                if(minTimer > subDate) {
                    minTimer = subDate
                }
            }
            viewTvUpdateTvProgramTimer = setTimeout(function() { getTvProgramList() }, minTimer + 1000);
        }

        $(programStr).appendTo($("#program_list"));
        $('#program_list').listview('refresh');
    });

    //番組情報の更新
    socketio.on("resultTvProgram", function (data) {
        if(data.streamNumber == getStreamNumber()) {
            var name = data.sqlResult[0]["name"];
            var title = data.sqlResult[0]["title"];
            var starttime = data.sqlResult[0]["starttime"];
            var endtime = data.sqlResult[0]["endtime"];
            var description = data.sqlResult[0]["description"];

            var time = new Date(endtime).getTime() - new Date().getTime();
            setTimeout(function() { getTvProgram() }, 1000 + time);

            $(".program_info_content").css('display', 'block');
            $("#program_info_station_name").text(name);
            $("#program_info_time").text(getFormatedDate(starttime) + " ~ " + getFormatedDate(endtime));
            $("#program_info_title").text(title);
            $("#program_info_description").text(description);
        }
    });

    //チューナー設定のリロード
    socketio.on("changeStreamStatus", function (data) {
        if($("#progChangeChannelDialog-popup").attr('class').indexOf("ui-popup-active") != -1) {
            socketio.emit("getChangeChannelConfig", socketid, getStreamNumber(), $("#dialogType").val());
        }
    });

    function updateOtherStreamInfo() {
        $("#other_stream").empty();
        for(var key in tmpStreamHash) {
            if(key != getStreamNumber()) {
                $("#other_stream").append(`<a class="ui-btn" href="viewtv?num=${key}" TARGET="_self">${tmpStreamHash[key]}</a>`);
            }
        }
    }

    function getFormatedDate(strDate) {
        var date = new Date(strDate);

        return ("0"+date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
    }
});

