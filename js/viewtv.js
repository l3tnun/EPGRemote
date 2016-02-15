function getStreamNumber() {
    return document.getElementById("streamNumber").value;
}

$(document).ready(function(){
    if(window.location.search.length == 0){
        if(getStreamNumber() =="undefined") {
            location.href='/';
        } else {
            location.href='/viewtv?num=' + getStreamNumber();
        }
    }
});

var tmptmpTunerId, tmpSid, tmpChannel, tmpName;
var tmpStreamHash;

socketio.on("enableStream", function (data) { loading(data.streamNumber, data.streamHash) });
socketio.on("errorStream", function (data) { errorStream(data.value) });
socketio.on("stopStream", function (data) { stopStream(data.value) });
socketio.on("reloadChangeChannel", function (data) { reloadChangeChannel(data.streamNumber)} ); //チャンネル変更ができたことの通知
socketio.on("resultChangeChannelList", function (data) { resultChangeChannelList(data) }); //チャンネル変更のためのチューナーリスト
socketio.on("resultTvProgramList", function (data) { resultTvProgramList(data) }); //番組表のリスト更新
socketio.on("resultTvProgram", function (data) { resultTvProgram(data) }); //番組情報の更新

function updateOtherStreamInfo() {
    $("#other_stream").empty();
    for(var key in tmpStreamHash) {
        if(key != getStreamNumber()) {
            $("#other_stream").append(`<a class="ui-btn" href="viewtv?num=${key}" TARGET="_self">${tmpStreamHash[key]}</a>`);
        }
    }
}

//loading gif
function loading(streamNumber, streamHash) {
    if(getStreamNumber() == streamNumber) {
        $("#loading").fadeOut();
        $("#container").fadeIn();
        $("#videoPlayer").get(0).play();
    }
    //他のストリーム情報を更新
    tmpStreamHash = streamHash;
    updateOtherStreamInfo();
}


/*配信停止関係*/
//server側のエラーで配信停止時
function errorStream(value) {
    if(getStreamNumber() == value) {
        location.href = "/viewtv_error";
    } else {
        delete tmpStreamHash[value];
        updateOtherStreamInfo();
    }
}

//正常に配信停止
function stopStream(value) {
    if(getStreamNumber() == value) {
        location.href = "/";
    } else {
        delete tmpStreamHash[value];
        updateOtherStreamInfo();
    }
}

//サーバへストリームの停止を依頼
function notiyStopStream() {
    socketio.emit("clientStopStream", getStreamNumber());
}


/*チャンネル変更関係*/
//チャンネル変更ができたことの通知
function reloadChangeChannel(streamNumber) {
    if(streamNumber == getStreamNumber()) {
        location.reload();
    }
}

//チャンネル変更をサーバに依頼
function notifyChangeChannel() {
    if($("#changeTuner").children().length == 0) { return; } //チューナーが無いとき
    if(typeof tmpTunerId != "undefined" && tmpTunerId == $("#changeTuner").children(':selected').val()) {
        socketio.emit("changeChannel", getStreamNumber(), tmpName, tmpSid, tmpChannel, $("#changeTuner").children(':selected').val(), $("#changeVideoSize").children(':selected').val());
    } else {
        $("#sid").html('<input type="hidden" name="sid" value='+ tmpSid + ' id="sid">');
        $("#channel").html('<input type="hidden" name="channel" value=' + tmpChannel + ' id="channel">');
        $("#channelName").html('<input type="hidden" name="channelName" value=' + tmpName + ' id="channelName">');
        document.new_stream_form.submit();
    }
}

//チャンネル変更のためのチューナーリスト取得
function resultChangeChannelList(data) {
    if(data.socketid == socketid) {
        //ダイアログの準備
        var tunerSelectStr = "";
        var tunerIndex = 0;

        for(var i = 0; i < data.tunerList.length; i++) {
            if(data.tunerList[i].id == data.tunerId) {
                tunerIndex = i;
                tmpTunerId = data.tunerId;
                tunerSelectStr += `<option value="${data.tunerList[i].id}">チャンネル変更</option>`;
            } else {
                tunerSelectStr += `<option value="${data.tunerList[i].id}">${data.tunerList[i].name}</option>`;
            }
        }

        var videoConfigStr = "";
        for(var i=0; i < data.videoConfig.length; i++) {
            videoConfigStr += `<option value="${data.videoConfig[i].id}">${data.videoConfig[i].size}</option>`;
        }

        //チャンネル名書き換え
        $("#dialogChannelName").text(tmpName);

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

        //ダイアログオープン
        $("#linkChangeChannelDialog").click();
    }
}

//サーバへチャンネル変更の情報取得を依頼
function notifyReceiveChangeChannelConfig(type, sid, channel, name) {
    tmpSid = sid;
    tmpChannel = channel;
    tmpName = name;
    socketio.emit("getChangeChannelConfig", socketid, getStreamNumber(), type);
}


/*番組情報関係*/
//番組情報の更新
function resultTvProgram(data) {
    if(data.streamNumber == getStreamNumber()) {
        var name = data.sqlResult[0]["name"];
        var title = data.sqlResult[0]["title"];
        var starttime = data.sqlResult[0]["starttime"];
        var endtime = data.sqlResult[0]["endtime"];
        var description = data.sqlResult[0]["description"];

        var timer = new Date(endtime).getTime() - new Date().getTime();
        setTimeout("getTvProgram()", 1000 + timer);

        $(".program_info_content").css('display', 'block');
        $("#program_info_station_name").text(name);
        $("#program_info_time").text(getFormatedDate(starttime) + " ~ " + getFormatedDate(endtime));
        $("#program_info_title").text(title);
        $("#program_info_description").text(description);
    }
}

//番組情報の取得をサーバに依頼する
function getTvProgram() {
    socketio.emit("getTvProgram", getStreamNumber());
}


/*番組表関係*/
//番組表のリスト更新
function resultTvProgramList(data) {
    if(data.id == socketid) {
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
            var type = "#" + data.value[0]["type"] + "_tab";
            setTimeout('$("' + type + '").click();', minTimer + 1000);
        }

        $(programStr).appendTo($("#program_list"));
        $('#program_list').listview('refresh');
    }
}

//タブ
$(function () {
    $(".tabs a").on('click', function(element) {
        type = element.target.id.substr(0, 2);

        $('.tab', $(this).closest('.tabs')).removeClass('active');
        $(this).closest('.tab').addClass('active');

        socketio.emit("getTvProgramList", type, socketid);
        setTimeout("getTvProgram()", 500);
    });
    $("#GR_tab").click();
});

/*util*/
function getFormatedDate(strDate) {
    var date = new Date(strDate);

    return ("0"+date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
}

