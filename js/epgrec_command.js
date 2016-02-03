//番組情報取得関係
var socketid;
var timeLength=0;
var recModeDefaultId=0;

function updateSocketid() {
    socketid = `${new Date().getTime()}:${Math.random().toString(36).slice(-8)}`;
}

$(function(){
    updateSocketid();
    var url = window.location.search;

    query = {};
    array  = url.slice(1).split('&');
    for (var i = 0; i < array.length; i++) {
        vars = array[i].split('=');
        query[vars[0]] = vars[1];
    }

    var type = query.type;
    var length = query.length;
    var time = query.time;

    if(typeof type == "undefined") { type = "GR"; }
    if(typeof length == "undefined") { length = 18; }
    if(typeof time == "undefined" || !(time.length >= 9  && time.length <= 10)) {
        var date = new Date();
        time = `${date.getFullYear()}${('0'+(date.getMonth()+1)).slice(-2)}${('0' + date.getDate()).slice(-2)}${('0'+ date.getHours()).slice(-2)}`;
    }

    timeLength = length;
    socketio.emit("getEPGRecProgramList", socketid, type, length, time);
});

socketio.on("resultEPGRecProgramList", function (data){
    var stationNameCnt = 0;
    var epgrecHeight = data.hourheight / 60;
    var maxTimeHeight = epgrecHeight * 60 * timeLength;

    data.genrus.forEach(function(genru) {
        $('#rec_genre').append($('<option>').html(`${genru.name_jp}`).val(`${genru.id}`));
    });

    var channles = {};
    data.channel.forEach(function(channel) {
        channles[channel.sid] = channel.id;
    });

    data.recMode.forEach(function(mode) {
         $('#rec_mode').append($('<option>').html(`${mode.name}`).val(`${mode.id}`));
    });

    recModeDefaultId = data.recModeDefaultId;

    if(data.socketid != socketid) { return; }
    data.json.forEach(function(station) {
        if(!(station["list"].length > 1)) { return; }
        var stationNameStr = `<a href="javascript:jumpViewTv('${station.sid}', '${station.channel}', '${station.station_name}')" class="station_name" style="color: white;">${station.station_name}</a>`;
        stationNameCnt += 1;
        $("#station_name_content").append(stationNameStr);

        var programStr = "";
        var timeHeightCnt = 0;

        programStr += '<div class="station">'
        for(var i = 0; i < station["list"].length; i++) {
            var program = station["list"][i];
            var title = program["title"];
            if(typeof title != "undefined" && timeHeightCnt < maxTimeHeight) {
                var classNameStr = `tv_program ctg_${program["genre"]} `
                if(program["rec"] == 1) { classNameStr += "tv_program_reced "; }
                if(program["autorec"] == 0) { classNameStr += "tv_program_freeze "; }

                if(typeof program["prg_start"] != "undefined") {
                    if(i == 0) {
                        programStr += `<div style="height:0px;">\n`
                        programStr += `<div class="" style="visibility: hidden;">dummy</div>\n`
                        programStr += `</div>\n`;
                    }
                    var pr_height = program["height"]/epgrecHeight*3;
                    if(timeHeightCnt + pr_height > maxTimeHeight) {
                        pr_height = maxTimeHeight - timeHeightCnt;
                    }
                    timeHeightCnt += pr_height;
                    programStr += `<div id="prgID_${program["id"]}" style="height:${pr_height}px;" class="${classNameStr}">\n`
                    if(program["id"] != 0) {
                        programStr += `<div class="pr_title">${program["title"]}</div>\n`
                        programStr += `<div class="pr_starttime">${program["starttime"]}</div>\n`
                        programStr += `<div class="pr_description">${program["description"]}</div>\n`
                        programStr += `<div class="pr_start">${program["prg_start"]}</div>\n`
                        programStr += `<div class="pr_rec">${program["rec"]}</div>\n`
                        programStr += `<div class="pr_autorec">${program["autorec"]}</div>\n`
                        programStr += `<div class="pr_keyword">${program["keyword"]}</div>\n`
                        programStr += `<div class="pr_genre">${program["genre"]}</div>\n`
                        programStr += `<div class="pr_sub_genre">${program["sub_genre"]}</div>\n`
                        programStr += `<div class="pr_channel_id">${channles[station.sid]}</div>\n`
                        programStr += `<div class="pr_station_name">${station.station_name}</div>\n`
                        if(typeof station["list"][i + 1] != "undefined") {
                            programStr += `<div class="pr_next_time">${station["list"][i + 1]["prg_start"]}</div>\n`
                        }
                    } else {
                        programStr += `<div class="pr_title" style="visibility: hidden;">NULL</div>\n`
                    }
                    programStr += `</div>\n`;
                }
            }
        }
        programStr += '</div>'
        $("#tv_program_content").append(programStr);
    });

    $("#station_name_content").css("width", (stationNameCnt * 140) + "px");
    $("#tv_program_content").css("width", (stationNameCnt * 140) + "px");
    setTvProgramClickDiaalog();

    moveTableNowBas();
    timerNowBars();
});

function closeDialogs(id) {
    if(id == $("#info_prgID").text() || id == $("#detail_rec_prgID").text()) {
        $('#progDialog').popup('close');
        $('#progDetailRecDialog').popup('close');

        return true;
    }

    return false;
}

function notifyGrowl(title, id) {
    if(typeof $("#" + id) == "undefined") { return; }
    var stationInfo = getStationInfo(id);
    $.growl({ title: title, message: stationInfo.pr_station_name + " " + stationInfo.pr_starttime + " " + stationInfo.pr_title, url: "#" });
}

function rec(id) {
    socketio.emit("getRec", id);
};

socketio.on("recResult", function (data) {
    var recv = data.value.match(/error/i);
    if( recv != null ) {
        if(closeDialogs(data.id)) {
            $.growl.error({ message: data.value });
        }
    } else {
        var pt = data.value.split( ':' );
        var r_id = parseInt(pt[0]);
        var tuner = pt[1];
        var reload = parseInt(pt[3]);

        if( reload ) {
            location.reload();
        } else {
            if( r_id ) {
                $('#prgID_' + r_id).addClass('tv_program_reced'); //赤枠追加
                notifyGrowl("簡易予約が入りました", 'prgID_' + data.id)
            }
            closeDialogs(data.id);
        }
    }
});

function customRec(id) {
    var program_id = 0;
    if($('#detail_program_id_checkbox').attr('checked')) { program_id = id; }
    var option = {
                    syear: $('#detail_rec_start_year').val(),
                    smonth: $('#detail_rec_start_month').val(),
                    sday: $('#detail_rec_start_day').val(),
                    shour: $('#detail_rec_start_hour').val(),
                    smin: $('#detail_rec_start_minute').val(),
                    ssec: $('#detail_rec_start_second').val(),
                    eyear: $('#detail_rec_end_year').val(),
                    emonth: $('#detail_rec_end_month').val(),
                    eday: $('#detail_rec_end_day').val(),
                    ehour: $('#detail_rec_end_hour').val(),
                    emin: $('#detail_rec_end_minute').val(),
                    esec: $('#detail_rec_end_second').val(),
                    channel_id: $('#detail_channel_id').text(),
                    record_mode: $('#rec_mode').val(),
                    title: $('#detail_rec_title').val(),
                    description: $('#detail_rec_description').val(),
                    category_id: $('#rec_genre').val(),
                    program_id: program_id,
                    discontinuity: ($('#detail_rec_discontinuity').attr('checked') ? "1" : "0"),
                    priority: $('#detail_rec_priority').val(),
                    ts_del: ($('#detail_rec_delete_file').attr('checked') ? "1" : "0")
                 };

    socketio.emit("getCustomRec", id, option);
}

socketio.on("resultCustomRec", function (data){
    var recv = data.value.match(/error/i);
    if( recv != null ) {
        if(closeDialogs(data.id)) {
            $.growl.error({ message: data.value });
        }
    } else {
        var pt = data.value.split( ':' );
        var r_id = parseInt(pt[0]);
        var tuner = pt[1];
        var reload = parseInt(pt[3]);

        if( reload ) {
            location.reload();
        } else {
            if( r_id ) {
                $('#prgID_' + r_id).addClass('tv_program_reced'); //赤枠追加
                notifyGrowl("詳細予約が入りました", 'prgID_' + data.id)
            }
            closeDialogs(data.id);
        }
    }
});

function cancelRec(id) {
    socketio.emit("getCancelRec", id);
}

socketio.on("cancelRecResult", function (data){
    var recv = data.value.match(/error/i);
    if( recv != null ) {
        if(closeDialogs(data.id)) {
            $.growl.error({ message: data.value });
        }
    } else {
        var reload = parseInt(data.value);
        if( reload ) {
            location.reload();
        } else {
            $('#prgID_' + data.id).removeClass('tv_program_reced');
                notifyGrowl("予約がキャンセルされました", 'prgID_' + data.id)
            closeDialogs(data.id);
        }
    }
});

function toggleAutoRec(id) {
    var autorec;
    if($("#prgID_" + id)[0].className.split(" ").indexOf("tv_program_freeze") >= 0) {
        autorec = 0;
    } else {
        autorec = 1;
    }

    socketio.emit("getToggleAutoRec", id, autorec);
}

socketio.on("autoRecResult", function (data){
    if(data.autorec) {
        $('#prgID_' + data.id).addClass('tv_program_freeze');
        notifyGrowl("自動予約禁止", 'prgID_' + data.id)
    } else {
        $('#prgID_' + data.id).removeClass('tv_program_freeze');
        notifyGrowl("自動予約許可", 'prgID_' + data.id)
    }
    closeDialogs(data.id);
});

function programSearch(id) {
    var info = $("#prgID_" + id).contents('div');
    var keyword;
    for(var i = 0; i < info.length; i++) {
        if(info[i].className == "pr_keyword") {
            keyword = info[i].innerHTML;
        }
    }

    socketio.emit("getEpgRecHostName");
    socketio.on("epgRecHostNameResult", function (data){
        urlStr = ""
        if(data.value.slice(-1) != "/") {
            urlStr = data.value + "/" + keyword;
        } else {
            urlStr = data.value + keyword;
        }
        location.href = "http://" + urlStr;
    });
    $('#progDialog').popup('close');
}

