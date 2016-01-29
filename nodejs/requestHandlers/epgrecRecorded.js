var path = require('path');
var util = require(__dirname + "/../util");
var viewer = require(__dirname + "/../viewer");
var sqlModel = require(__dirname + "/../sqlModel");
var log = require(__dirname + "/../logger").getLogger();
var createPageNumber = require(__dirname + "/createPageNumber");

module.exports = function(response, parsedUrl, request) {
    log.access.info("Request handler 'epgrec recorded' was called.");

    var ua = JSON.stringify(request.headers['user-agent']).toLocaleLowerCase();
    sqlModel.getRecordedList( function(results) {
        if(results == '') { notFound(response); return; }

        //チャンネル名
        var channelName = {}
        results[0].forEach(function(result) {
            channelName[result.id] = result.name
        });

        //mp4ファイルのパス
        var config = util.getConfig()["epgrecConfig"]
        var videoPaths = {}
        results[1].forEach(function(result) {
            var videoPath = result.path.toString('UTF-8').replace(config.videoPath, "");
            videoPaths[result.rec_id] = {"vide_status" : result.status, "path" : `${path.join(config.host, "video", videoPath)}`};
        });

        //tag パラメータ
        var parameter;
        var parameterHash = {
            "keyword" : { "sqlData" : "autorec", "query" : "keyword" },
            "channel" : { "sqlData" : "channel_id", "query" : "channel" }
        };

        if(typeof parsedUrl.query.keyword != "undefined") { parameter = parameterHash.keyword }
        if(typeof parsedUrl.query.channel != "undefined") { parameter = parameterHash.channel }

        if(typeof parameter != "undefined") {
            var newRecorded = [];
            results[2].forEach(function(result) {
                if(result[parameter.sqlData] == parsedUrl.query[parameter.query]) {
                    newRecorded.push(result);
                }
            });
            results[2] = newRecorded;
        }

        //録画一覧
        var pageNum = createPageNumber(parsedUrl.query.num);
        var i = 0;
        var programs = []
        results[2].forEach(function(result) {
            if(i >= pageNum.min && i < pageNum.max) {
                program = {}
                program.id = result.id
                program.thumbs = `http://${util.getConfig().epgrecConfig.host}/thumbs/${path.basename(result.path.toString('UTF-8'))}.jpg`;
                if(typeof videoPaths[result.id] == "undefined" || videoPaths[result.id].vide_status != 2) {
                    program.videLink = "javascript:openVideoNotFoundDialog()";
                } else if(ua.indexOf('ipad') != -1 || ua.indexOf('ipod') != -1 || ua.indexOf('iphone') != -1) {
                    program.videLink = `vlc://${videoPaths[result.id].path}`;
                } else {
                    program.videLink = `http://${videoPaths[result.id].path}`;
                }
                program.title = result.title;
                program.info = `${getDateStr(result.starttime)} ${channelName[result.channel_id]}`;
                program.description = result.description;
                programs.push(program);
            }
            i++;
        });

        viewer.epgrecRecorded(response, programs);
    });
}

function getDateStr(d) {
    var days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${("0" + (d.getMonth() + 1)).slice(-2)}/${("0" + d.getDate()).slice(-2)}(${days[d.getDay()]}) ${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}`
}

