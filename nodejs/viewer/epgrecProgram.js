var log = require(__dirname + "/../logger").getLogger();
var util = require(__dirname + "/../util");
var readFile = require(__dirname + "/readFile");
var notFound = require(__dirname + "/notFound");
var responseFile = require(__dirname + "/responseFile");

module.exports = function(response, length, time, type, ch) {
    log.access.info("viewer 'epgrecProgram' was called.");

    //title
    var strYear = time.substr(0, 4);
    var strMon = time.substr(4, 2);
    var strDate = time.substr(6, 2);
    var strHour = time.substr(8, 2);
    var titleStr = `${type} ${strYear}年${strMon}月${strDate}日${strHour}時〜`;

    var urlOption = '';
    if(typeof ch != "undefined") {
        urlOption = `ch=${ch}&type=${type}`
    } else {
        urlOption = `type=${type}`;
    }

    //time
    var startHour = Number(time.substr(8, 2));
    var endHour = startHour + Number(length) - 1;
    var timeStr = ""
    var tvTimeLength = util.getConfig()["tvTimeLength"];

    timeStr += "<div>"
    console.log(tvTimeLength * Number(strHour));
    for(var i = 0; i < 2; i++) {
        timeStr += `<div style="background-image: linear-gradient( 180deg, rgb(150, 0, 255) -1%, rgb(6, 0, 255) 10%, rgb(126, 186, 0) 28%, rgb(255, 174, 0) 45%, rgb(255, 114, 0) 60%, rgb(255, 64, 0) 77%, rgb(150, 0, 255) 90% ); position: relative; top: -${tvTimeLength * Number(strHour)}px">`
        for(var j = 0; j < 24; j++) {
            timeStr += `<div class="time" style="height: ${tvTimeLength}px;">${j}</div>\n`
        }
        timeStr += "</div>"
    }
    timeStr += "</div>"

    //menueTime
    var menuTime = "";
    for(var i = 0; i <= 22; i+=2) {
        menuTime += `<a href="/epgrec_program?${urlOption}&time=${strYear + strMon + strDate + ("0" + i).slice(-2)}" data-ajax="false" onclick="javascript:$('#progMenuDialog').popup('close');" class="menu_hour_button" style="color: white;">${("0" + i).slice(-2)}</a>\n`;
    }

    //menueDate
    var menuDate = `<a href="/epgrec_program?${urlOption}" data-ajax="false" onclick="javascript:$('#progMenuDialog').popup('close');" class="menu_hour_button" style="color: white;">現在</a>\n`;
    for(var i = -1; i < 8; i++) {
        var strDate = getAddDate(strYear, strMon, strDate, i);
        menuDate += `<a href="/epgrec_program?${urlOption}&time=${strDate["year"]}${strDate["month"]}${strDate["date"]}${("0" + strHour).slice(-2)}" data-ajax="false" onclick="javascript:$('#progMenuDialog').popup('close');" class="menu_hour_button" style="color: white;">${strDate["date"]}(${strDate["day"]})</a>\n`;
    }

    //menueBroadcastWave
    var menueBroadcastWave = "";
    var broadcastWave = [];
    var broadcast = util.getConfig()["broadcast"];
    for (var key in broadcast) { if(broadcast[key] != false) { broadcastWave.push(key) } }
    if(typeof ch != "undefined") { length = 24; }
    for(var i = 0; i < broadcastWave.length; i++) {
        menueBroadcastWave += `<a href="/epgrec_program?type=${broadcastWave[i]}&time=${time}" data-ajax="false" onclick="javascript:$('#progMenuDialog').popup('close');" class="menu_hour_button" style="color: white;">${broadcastWave[i]}</a>\n`;
    }

    var htmlfile = readFile("./HTML/epgrecprogram.html");
    if(typeof htmlfile == "undefined") { notFound(response, 'file not found'); return; }
    htmlfile = htmlfile.replace(/@@@MENUTIME@@@/g, menuTime);
    htmlfile = htmlfile.replace(/@@@MENUDATE@@@/g, menuDate);
    htmlfile = htmlfile.replace(/@@@MENUWAVE@@@/g, menueBroadcastWave);
    htmlfile = htmlfile.replace(/@@@TITLE@@@/g, titleStr);
    htmlfile = htmlfile.replace("@@@TIME@@@", timeStr);
    responseFile(response, htmlfile);
}

function getAddDate(year, month, date, num) {
    var days = ['日', '月', '火', '水', '木', '金', '土'];
    var d = new Date();
    d.setDate(d.getDate() + num);
    return {
        year: String(d.getFullYear()),
        month: ("0" + (d.getMonth() + 1)).slice(-2),
        date: ("0" + d.getDate()).slice(-2),
        day: days[d.getDay()]
    };
}

