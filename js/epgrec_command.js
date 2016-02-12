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

    var query = getQuery();
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

var programHash = {}, channelHash = {};
socketio.on("resultEPGRecProgramList", function (data) {
    if(data.socketid != socketid) { return; }

    var genruStr = ""
    data.genrus.forEach(function(genru) {
        genruStr += $('<option>').html(`${genru.name_jp}`).val(`${genru.id}`);
    });
    $('#rec_genre').append(genruStr);

    var recModeStr = ""
    data.recMode.forEach(function(mode) {
        recModeStr += $('<option>').html(`${mode.name}`).val(`${mode.id}`);
    });
    $('#rec_mode').append(recModeStr);

    recModeDefaultId = data.recModeDefaultId;

    $("#station_name_content").append(data.htmlVars.stationNameStr);
    $("#tv_program_content").append(data.htmlVars.programStr);

    $("#station_name_content").css("width", (data.htmlVars.stationNameCnt * 140) + "px");
    $("#tv_program_content").css("width", (data.htmlVars.stationNameCnt * 140) + "px");
    setTvProgramClickDiaalog();

    programHash = data.htmlVars.programHash;
    channelHash = data.htmlVars.channelHash;

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
    if(typeof stationInfo == "undefined" || typeof stationInfo.pr_station_name == "undefined") { return; }
    $.growl({ title: title, message: stationInfo.pr_station_name + " " + stationInfo.pr_starttime + " " + stationInfo.pr_title });
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
                notifyGrowl("簡易予約", 'prgID_' + data.id)
            }
            closeDialogs(data.id);
        }
    }
});

function customRec(id) {
    var program_id = 0;
    if($('#detail_program_id_checkbox').prop('checked')) { program_id = id; }
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
                    discontinuity: ($('#detail_rec_discontinuity').prop('checked') ? "1" : "0"),
                    priority: $('#detail_rec_priority').val(),
                    ts_del: ($('#detail_rec_delete_file').prop('checked') ? "1" : "0")
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
                notifyGrowl("詳細予約", 'prgID_' + data.id)
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
                notifyGrowl("予約キャンセル", 'prgID_' + data.id)
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

    keyword = keyword.replace(/&(gt|lt|#039|quot|amp);/ig, function($0, $1) {
        if (/^gt$/i.test($1))   return ">";
        if (/^lt$/i.test($1))   return "<";
        if (/^#039$/.test($1))  return "'";
        if (/^quot$/i.test($1)) return "\"";
        if (/^amp$/i.test($1))  return "&";
    });

    $('#progDialog').popup('close');
    var searchUrl = keyword.replace("programTable.php", "/epgrec_search");
    setTimeout(`jumpSearch("${searchUrl}")`, 250);
}

function jumpSearch(searchUrl) {
    location.href = searchUrl;
}

