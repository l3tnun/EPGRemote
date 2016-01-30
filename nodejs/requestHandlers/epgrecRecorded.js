var path = require('path');
var util = require(__dirname + "/../util");
var viewerEpgrecRecorded = require(__dirname + "/../viewer/epgrecRecorded");
var sqlModel = require(__dirname + "/../sqlModel");
var log = require(__dirname + "/../logger").getLogger();
var createPageNumber = require(__dirname + "/createPageNumber");
var notFound = require(__dirname + "/notFound");

module.exports = function(response, parsedUrl, request) {
    log.access.info("Request handler 'epgrec recorded' was called.");
    var configJson = util.getConfig();
    var ua = JSON.stringify(request.headers['user-agent']).toLocaleLowerCase();

    sqlModel.getRecordedList(15, parsedUrl.query.num, { "autorec" : parsedUrl.query.keyword, "channel_id" : parsedUrl.query.channel }, function(results) {
        if(results == '') { notFound(response); return; }

        //チャンネル名
        var channelName = {}
        results[0].forEach(function(result) {
            channelName[result.id] = result.name
        });

        //録画ファイルのパス
        var epgrecConfig = configJson["epgrecConfig"]
        var videoPaths = {}
        if(util.getConfig().RecordedFileExtension == "ts") {
            results[2].forEach(function(result) {
                videoPaths[result.id] = { "vide_status" : 2, "filename" : result.title + ".ts", "path" : result.path.toString('utf-8') }
            });
        } else {
            results[1].forEach(function(result) {
                var videoPath = result.path.toString('UTF-8').replace(configJson.epgrecConfig.videoPath, "");
                videoPaths[result.rec_id] = { "vide_status" : result.status, "filename" : path.basename(videoPath), "path" : videoPath };
            });
        }

        //録画一覧
        var programs = []
        results[2].forEach(function(result) {
            program = {}
            program.id = result.id
            program.thumbs = `/thumbs/${path.basename(result.path.toString('UTF-8'))}.jpg`;
            if(typeof videoPaths[result.id] == "undefined" || videoPaths[result.id].vide_status != 2) {
                program.videLink = "javascript:openVideoNotFoundDialog()";
                program.downloadLink = "javascript:openVideoNotFoundDialog()";
            } else if(ua.indexOf('ipad') != -1 || ua.indexOf('ipod') != -1 || ua.indexOf('iphone') != -1) {
                var address = `http://${configJson.serverIP}:${configJson.serverPort}/video/videoid${result.id}.${configJson.RecordedFileExtension}`;
                program.videLink = configJson.RecordedStreamingiOSURL.replace("ADDRESS", address);
                program.downloadLink = configJson.RecordedDownloadiOSURL.replace("ADDRESS", address).replace("FILENAME", path.basename(videoPaths[result.id].path));
            } else {
                program.videLink = path.join("video", videoPaths[result.id].path);
                program.downloadLink = path.join("video", videoPaths[result.id].path) + "?mode=download";
            }
            program.title = result.title;
            program.info = `${getDateStr(result.starttime)} ${channelName[result.channel_id]}`;
            program.description = result.description;
            programs.push(program);
        });

        viewerEpgrecRecorded(response, programs);
    });
}

function getDateStr(d) {
    var days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${("0" + (d.getMonth() + 1)).slice(-2)}/${("0" + d.getDate()).slice(-2)}(${days[d.getDay()]}) ${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}`
}

