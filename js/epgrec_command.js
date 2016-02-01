//番組情報取得関係
var socketid;
var timeLength=0;

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

function rec(id) {
    socketio.emit("getRec", id);
};

socketio.on("recResult", function (data) {
    var recv = data.value.match(/error/i);
    if( recv != null ){
        alert(data.value);
        $('#progDialog').popup('close');
    } else {
        var pt = data.value.split( ':' );
        var r_id = parseInt(pt[0]);
        var tuner = pt[1];
        var reload = parseInt(pt[3]);

        if( reload ){
            location.reload();
        } else {
            if( r_id ) {
                $('#prgID_' + r_id).addClass('tv_program_reced'); //赤枠追加
            }
            $('#progDialog').popup('close');
        }
    }
});

function cancelRec(id) {
    socketio.emit("getCancelRec", id);
    socketio.on("cancelRecResult", function (data){
        var recv = data.value.match(/^error/i);
        if( recv != null ){
            alert(data.value);
            $('#progDialog').popup('close');
        } else {
            var reload = parseInt(data.value);
            if( reload ){
                location.reload();
            } else {
                $('#prgID_' + id).removeClass('tv_program_reced');
            }
            $('#progDialog').popup('close');
        }
    });
}

function toggleAutoRec(id) {
    var autorec;
    if($("#prgID_" + id)[0].className.split(" ").indexOf("tv_program_freeze") >= 0) {
        autorec = 0;
    } else {
        autorec = 1;
    }

    socketio.emit("getToggleAutoRec", id, autorec);
    socketio.on("autoRecResult", function (data){
        if(id != data.id) { return; }
        if(autorec) {
            $('#prgID_' + id).addClass('tv_program_freeze');
        } else {
            $('#prgID_' + id).removeClass('tv_program_freeze');
        }
        $('#progDialog').popup('close');
    });
}

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

