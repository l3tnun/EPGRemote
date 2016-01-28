var fs = require('fs')
var path = require('path');
var tunerManager = require(__dirname + "/tunerManager");
var util = require(__dirname + "/util");
var log = require(__dirname + "/logger").getLogger();

function readFile(filepath) {
    fullFilePath = path.join(util.getRootPath(), filepath);
    if(fs.existsSync(fullFilePath)) {
        return fs.readFileSync(fullFilePath, 'utf-8');
    } else {
        log.access.error("file not found");
        return;
    }
}

function responseFile(response, str) {
    if(typeof str == "undefined") {
        return notFound(response)
    } else {
        response.writeHead(200,{'content-Type': 'text/html'});
        response.write(str);
        response.end();
    }
}

function topPage(response, streamStatus) {
    var htmlfile = readFile("/HTML/index.html");
    if(typeof htmlfile == "undefined") { notFound(response, 'file not found'); return; }
    var channelStr = " ";
    if(Object.keys(streamStatus).length > 0) {
        channelStr += '<li data-role="list-divider"><center>現在放送中</center></li>'
         for (var key in streamStatus){
            channelStr += `<li><a href="viewtv?num=${key}" TARGET="_self">${streamStatus[key].channelName}</a></li>`
        }
    }
    responseFile(response, htmlfile.replace("@@@CHANNEL@@@", channelStr));
}

function settings(response) {
    var htmlfile = readFile("./HTML/settings.html");
    if(typeof htmlfile == "undefined") { notFound(response, 'file not found'); return; }
    responseFile(response, htmlfile);
}

function tvProgram(response, results, GR, BS, CS, EX) {
    var htmlfile = readFile("./HTML/tvprogram.html");
    if(typeof htmlfile == "undefined") { notFound(response, 'file not found'); return; }
    var date = new Date();

    var tunerNames = [];
    var tunerResults;

    if(GR) {
        tunerResults = tunerManager.getActiveTuner("GR");
    } else if(BS || CS) {
        tunerResults = tunerManager.getActiveTuner("BS");
    } else {
        tunerResults = tunerManager.getActiveTuner("EX");
    }

    var tunerStr = "";
    for(var i = 0; i < tunerResults.length; i++) {
        tunerStr += `<option value=\"${tunerResults[i]['id']}\">${tunerResults[i]['name']}</option>\n`;
    }

    var videoConfigs = tunerManager.getVideoSize();
    var videoStr = ""
    for(var i = 0; i < videoConfigs.length; i++) {
        videoStr += `<option value=\"${videoConfigs[i]['id']}\">${videoConfigs[i]['size']}</option>\n`;
    }

    var programStr = ""
    if(!results) {
        programStr += "番組情報が取得できませんでした。"
    } else {
        results.forEach(function(result){
            if((result["type"] == "GR" && GR) || (result["type"] == "BS" && BS) || (result["type"] == "CS" && CS) || (result["type"] == "EX" && EX)) {
                programStr += `<li><a href=\"javascript:postData('${result["sid"]}', '${result["channel"]}', '${result["name"]}')\" TARGET=\"_self\">`
                programStr += `<h3>${result["name"]}</h3>`
                programStr += `<p>${formatDate(result["starttime"])} ~ ${formatDate(result["endtime"])}</p>`
                programStr += `<p>${result["title"]}</p>`
                programStr += `<p class="wordbreak">${result["description"]}</p>`
                programStr += `</a></li>\n`;
            }
        });
    }
    htmlfile = htmlfile.replace("@@@TUNNER@@@", tunerStr);
    htmlfile = htmlfile.replace("@@@VIDEOCONFIG@@@", videoStr);
    htmlfile = htmlfile.replace("@@@TVPROGRAM@@@", programStr);
    responseFile(response, htmlfile);
}

function formatDate(result) {
     date = new Date(result);
     return ( '0' + date.getHours()).slice( -2 ) + ":" + ( '0' + date.getMinutes() ).slice( -2 );
}

function viewTv(response, streamNumber) {
    var htmlfile = readFile("./HTML/viewtv.html");
    if(typeof htmlfile == "undefined") { notFound(response, 'file not found'); return; }
    var videoTag = `streamfiles/stream${streamNumber}.m3u8`;

    htmlfile = htmlfile.replace("@@@TVWAATCH@@@", videoTag);
    htmlfile = htmlfile.replace("@@@STREAMNUMBER@@@", streamNumber);
    responseFile(response, htmlfile);
}

function viewTvError(response) {
    var htmlfile = readFile("./HTML/viewtv_error.html");
    responseFile(response, htmlfile);
}

function responseSpecifiedFile(response, parsedUrl, fileTypeHash) {
    var uri = parsedUrl.pathname;
    var filename;

    if (uri.match(/streamfiles/)) {
        filename = path.join(util.getConfig()["streamFilePath"], path.basename(uri));
    } else {
        filename = path.join(util.getRootPath(), uri);
    }

    fs.exists(filename, function (exists) {
        if (!exists) {
            log.access.error(`${filename} is not found`);
            notFound(response);
            return;
        } else {
            fs.readFile(filename, function (err, contents) {
                if (err) {
                    log.access.error('failed send file: ' + filename);
                    internalServerError(response);
                } else if (contents) {
                    response.writeHead(200, {'Content-Type': fileTypeHash[path.extname(uri)]});
                    if(path.extname(uri) == ".ts" || path.extname(uri) == ".mp4") {
                        log.stream.info('sending file: ' + filename);
                        var stream = fs.createReadStream(filename, { bufferSize: 64 * 1024 });
                        stream.pipe(response);
                    } else {
                        log.access.info('sending file: ' + filename);
                        response.write(contents);
                        response.end();
                    }
                }
            });
        }
    });
}

function notFound(response, str) {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found\n");
    if(typeof str != "undefined") { response.write(str); }
    response.end();
}

function internalServerError(response) {
    response.writeHead(500);
    response.end();
}

function epgrec(response) {
    var htmlfile = readFile("./HTML/epgrec.html")
    if(typeof htmlfile == "undefined") { notFound(response, 'file not found'); return; }
    responseFile(response, htmlfile);
}

function epgrecProgram(response, length, time, type) {
    //time
    var hour = Number(time.substr(8, 2));
    var timeStr = ""
    for(var i = 0; i < length; i++) {
        if(hour + i > 23) {
            timeStr += `<div class="time">${hour + i - 24}</div>\n`
        } else {
            timeStr += `<div class="time">${hour + i}</div>\n`
        }
    }

    //title
    var strYear = time.substr(0, 4);
    var strMon = time.substr(4, 2);
    var strDate = time.substr(6, 2);
    var strHour = time.substr(8, 2);
    var titleStr = `${type} ${strYear}年${strMon}月${strDate}日${strHour}時〜`;

    //menueTime
    var menuTime = "";
    for(var i = 2; i <= 24; i+=2) {
        menuTime += `<a href="/epgrec_program?type=${type}&length=${length}&time=${strYear + strMon + strDate + ("0" + i).slice(-2)}" data-ajax="false" onclick="javascript:$('#progMenuDialog').popup('close');" class="menu_hour_button" style="color: white;">${("0" + i).slice(-2)}</a>\n`;
    }

    //menueDate
    var menuDate = `<a href="/epgrec_program?type=${type}&length=${length}" data-ajax="false" onclick="javascript:$('#progMenuDialog').popup('close');" class="menu_hour_button" style="color: white;">現在</a>\n`;
    for(var i = -1; i < 8; i++) {
        var strDate = getAddDate(strYear, strMon, strDate, i);
        menuDate += `<a href="/epgrec_program?type=${type}&length=${length}&time=${strDate["year"]}${strDate["month"]}${strDate["date"]}${("0" + strHour).slice(-2)}" data-ajax="false" onclick="javascript:$('#progMenuDialog').popup('close');" class="menu_hour_button" style="color: white;">${strDate["date"]}(${strDate["day"]})</a>\n`;
    }

    //menueBroadcastWave
    var menueBroadcastWave = "";
    var broadcastWave = ['GR', 'BS', 'CS', 'EX'];
    for(var i = 0; i < broadcastWave.length; i++) {
        menueBroadcastWave += `<a href="/epgrec_program?type=${broadcastWave[i]}&length=${length}&time=${time}" data-ajax="false" onclick="javascript:$('#progMenuDialog').popup('close');" class="menu_hour_button" style="color: white;">${broadcastWave[i]}</a>\n`;
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

function epgrecRecorded(response, programs) {
    var programStr = ""
    programs.forEach(function(program) {
        programStr += `<li data-icon="delete"><a href="${program.videLink}" target="_self">`
        programStr += `<img src="${program.thumbs}">`
        programStr += `<h3>${program.title}</h3>`
        programStr += `<p>${program.info}</p>`
        programStr += `<p>${program.description}</p>`
        programStr += `</a><a href="javascript:openDeleteDialog(${program.id}, '${program.title}')"></a></li>`
    });

    var htmlfile = readFile("./HTML/epgrecrecorded.html");
    htmlfile = htmlfile.replace(/@@@PROGRAM@@@/g, programStr);
    responseFile(response, htmlfile);
}

function epgrecRecordedKeywordsTag(response, keywords) {
    console.log(keywords);
    var tagListStr = ""
    keywords.forEach(function(keyword) {
        if(keyword.cnt == 0) { return; }
        tagListStr += `<li><a href="#" target="_self">`
        tagListStr += `<h3>${keyword.keyword}</h3>`
        tagListStr += `<span class="ui-li-count">${keyword.cnt}</span></a></li>`
    });

    var htmlfile = readFile("./HTML/epgrecrecordedtag.html");
    htmlfile = htmlfile.replace("@@@TAGLIST@@@", tagListStr);
    responseFile(response, htmlfile);
}

function epgrecRecordedChannelTag(response, channels) {
    console.log(channels);
    var tagListStr = ""
    channels.forEach(function(channel) {
        tagListStr += `<li><a href="#" target="_self">`
        tagListStr += `<h3>${channel.channelName}</h3>`
        tagListStr += `<span class="ui-li-count">${channel.cnt}</span></a></li>`
    });

    var htmlfile = readFile("./HTML/epgrecrecordedtag.html");
    htmlfile = htmlfile.replace("@@@TAGLIST@@@", tagListStr);
    responseFile(response, htmlfile);
}

exports.topPage = topPage;
exports.settings = settings;
exports.tvProgram = tvProgram;
exports.viewTv = viewTv;
exports.viewTvError = viewTvError;
exports.responseSpecifiedFile = responseSpecifiedFile;
exports.notFound = notFound;
exports.epgrec = epgrec;
exports.epgrecProgram = epgrecProgram;
exports.epgrecRecorded = epgrecRecorded;
exports.epgrecRecordedKeywordsTag = epgrecRecordedKeywordsTag;
exports.epgrecRecordedChannelTag = epgrecRecordedChannelTag;

