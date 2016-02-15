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

socketio.on("resultEPGRecProgramList", function (data) {
    if(data.socketid != socketid) { return; }

    data.genrus.forEach(function(genru) {
        $('#rec_genre').append($('<option>').html(`${genru.name_jp}`).val(`${genru.id}`));
    });

    data.recMode.forEach(function(mode) {
        $('#rec_mode').append($('<option>').html(`${mode.name}`).val(`${mode.id}`));
    });

    recModeDefaultId = data.recModeDefaultId;
});

var programHash = {}, channelHash = {};
socketio.on("HashOfEPGProgramData", function (data) {
    if(data.socketid != socketid) { return; }

    var channel = data.stationNameHash;
    var programStr = "";
    var stationNameStr = "";

    stationNameStr += `<a href="javascript:jumpViewTv('${channel.sid}', '${channel.channel}', '${channel.name}')" class="station_name" style="color: white;">${channel.name}</a>`;

    //dummy
    programStr += '<div class="station">\n';
    programStr += `<div style="height:0px;">\n`
    programStr += `<div class="" style="visibility: hidden;">dummy</div>\n`
    programStr += `</div>\n`;

    data.programArray.forEach(function(program) {
        if(program.id == -1) {
            programStr += `<div id="prgID_${-1}" style="height:${program.height}px;" class="tv_program_freeze">\n`;
            programStr += `<div class="pr_title"></div>\n`;
            programStr += `</div>\n`;
            return;
        }

        var classNameStr = `tv_program ctg_${program.category_id} `
        if(program.rec) { classNameStr += "tv_program_reced "; }
        if(program.autorec == 0) { classNameStr += "tv_program_freeze "; }
        programStr += `<div id="prgID_${program.id}" style="height:${program.height}px;" class="${classNameStr}">\n`;
        programStr += `<div class="pr_title">${program.title}</div>\n`;
        programStr += `<div class="pr_starttime">${getTimeStr(program.starttime)}</div>\n`;
        programStr += `<div class="pr_description">${program.description}</div>\n`;
        programStr += `</div>\n`;

        programHash[program.id] = program;
    });

    programStr += `</div>\n`;

    channelHash[channel.id] = channel;

    $("#station_name_content").append(stationNameStr);
    $("#tv_program_content").append(programStr);
});

socketio.on("finishEPGProgramDataSend", function (data) {
    if(data.socketid != socketid) { return; }

    $("#station_name_content").css("width", (data.stationNameCnt * 140) + "px");
    $("#tv_program_content").css("width", (data.stationNameCnt * 140) + "px");

    setTvProgramClickDiaalog();
    moveTableNowBas();
    timerNowBars();
    var scrollsize = window.innerWidth - $(window).outerWidth(true);
    var contentHeight = Number($("#tv_program_content").css("height").replace("px", "")) - Number($("#station_name_id").css("height").replace("px", "")) - scrollsize;
    $("#tv_program_content").css("height", contentHeight + "px");
});

function getTimeStr(str) {
    var d = new Date(str);
    return `${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}:${("0" + d.getSeconds()).slice(-2)}`;
}

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
    var stationInfo = programHash[id.replace("prgID_", "")];
    if(typeof stationInfo == "undefined") { return; }
    $.growl({ title: title, message: channelHash[stationInfo.channel_id].name + " " + getTimeStr(stationInfo.starttime) + " " + stationInfo.title });
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
    var info = programHash[id];

    $('#progDialog').popup('close');
    var searchUrl = makeKeywordUrl(info.title, info.type, info.channel_id, info.category_id, info.sub_genre);
    setTimeout(`jumpSearch("${searchUrl}")`, 250);
}

function jumpSearch(searchUrl) {
    location.href = searchUrl;
}

function makeKeywordUrl( title, type, channel_id, genre, sub_genre ){
    if(title == "") { return ""; }

    var out_title = title.trim();
    var delimiter;
    if(out_title.indexOf(" #") == -1 ) {
        delimiter = out_title.indexOf('「') == -1 ? "" : "「";
    } else {
        delimiter = " #";
    }

    var keyword = [];
    if( delimiter != "" ){ keyword = out_title.split(delimiter); }
    if( typeof keyword[0] == "undefined" || keyword[0].length == 0 || keyword[0] == "" ) { keyword[0] = out_title; }
    keyword[0] = keyword[0].replace(" ", "%");

    return `/epgrec_search?search=${keyword[0]}&type=${type}&station=${channel_id}&category_id=${genre}&sub_genre=${sub_genre}`;
}

