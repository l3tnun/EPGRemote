var url = require("url");
var path = require('path');
var fs = require('fs');
var util = require(__dirname + "/util");
var viewer = require(__dirname + "/viewer");
var sqlModel = require(__dirname + "/sqlModel");
var streamManager = require(__dirname + "/streamManager");
var tunerManager = require(__dirname + "/tunerManager");
var io = require(__dirname + "/socketIoServer");
var epgrecManager = require(__dirname + "/epgrecManager");
var log = require(__dirname + "/logger").getLogger();

function topPage(response, parsedUrl) {
    log.access.info("Request handler 'topPage' was called.");
    viewer.topPage(response, streamManager.getStreamStatus());
}

function settings(response, parsedUrl) {
    log.access.info("Request handler 'settings' was called.");
    viewer.settings(response);
}

function tvProgram(response, parsedUrl) {
    log.access.info("Request handler 'tvProgram' was called.");
    var callback = function(results) {
        log.access.debug("called callback");
        viewer.tvProgram(response, results, parsedUrl.query.GR, parsedUrl.query.BS, parsedUrl.query.CS, parsedUrl.query.EX);
    };

    sqlModel.getNowEpgData(callback);
}

function viewTv(response, parsedUrl, request, postData) {
    log.access.info("Request handler 'viewTv' was called.");
    var parsedPostQuery = url.parse("?" + postData, true).query;
    var configJson = util.getConfig();

    if(postData != "") { //ストリーム開始
        var streamNumber = streamManager.getEmptyStreamNumber();
        var videoConfig = tunerManager.getVideoConfig(parsedPostQuery.size);

        //tunerとffmpegのバイナリの存在チェック
        var tunerBinPath = tunerManager.getTunerComand(parsedPostQuery.tuner, parsedPostQuery.sid, parsedPostQuery.channel).split(' ')[0];
        var ffmpegBinPath = configJson["ffmpeg"]["command"].split(' ')[0];

        //tunerコマンドの存在確認
        if(!fs.existsSync(tunerBinPath) || !fs.existsSync(ffmpegBinPath)) {
            log.stream.error('tuner or ffmpeg not found');
            log.stream.error('tuner : ' + tunerBinPath);
            log.stream.error('ffmpeg : ' + ffmpegBinPath);
            viewer.notFound(response, "tuner bin is not found.");
            return;
        }

        io.setStopStreamCallback(streamManager.stopStream);
        if(tunerManager.lockTuner(parsedPostQuery.tuner, streamNumber)) {
            viewer.viewTv(response, streamNumber);
            streamManager.startStream(streamNumber, parsedPostQuery.channelName , videoConfig, parsedPostQuery.channel, parsedPostQuery.sid, parsedPostQuery.tuner);
            streamManager.streamNotifyEnable(streamNumber);
        } else { //tunerがロックされていた
            viewer.notFound(response, "tuner is locked");
        }
    } else { //すでに配信中のものを見る
        viewer.viewTv(response, parsedUrl.query.num);
        setTimeout(function(){
            streamManager.streamNotifyEnable(parsedUrl.query.num);
        },1000);
    }
}

function viewTvError(response, parsedUrl) {
    log.access.info("Request handler 'viewTvError' was called.");
    viewer.viewTvError(response);
}

function responseSpecifiedFile(response, parsedUrl, fileTypeHash) {
    log.access.info("Request handler 'responseSpecifiedFile' was called.");
    viewer.responseSpecifiedFile(response, parsedUrl, fileTypeHash);
}

function notFound(response) {
    log.access.info("No request handler found.");
    viewer.notFound(response);
}

function epgrec(response, parsedUrl) {
    log.access.info("Request handler 'epgrec' was called.");
    viewer.epgrec(response);
}

function epgrecProgram(response, parsedUrl) {
    log.access.info("Request handler 'epgrecProgram' was called.");
    var type = parsedUrl.query.type;
    var length = parsedUrl.query.length;
    var time = parsedUrl.query.time;

    if(typeof type == "undefined") { type = "GR"; }
    if(typeof length == "undefined") { length = 18; }
    if(typeof time == "undefined" || !(time.length >= 9  && time.length <= 10)) {
        var date = new Date();
        time = `${date.getFullYear()}${('0'+date.getMonth()+1).slice(-2)}${('0' + date.getDate()).slice(-2)}${('0' + date.getHours()).slice(-2)}`;
    }

    viewer.epgrecProgram(response, length, time, type);
}

function epgrecRecorded(response, parsedUrl, request) {
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

        //ページ番号
        var num;
        if(typeof parsedUrl.query.num == "undefined" || parsedUrl.query.num < 2) {
            num = 1;
        } else {
            num = Number(parsedUrl.query.num);
        }
        var min = (num - 1) * 15;
        var max = num * 15;

        //録画一覧
        var i = 0;
        var programs = []
        results[2].forEach(function(result) {
            if(i >= min && i < max) {
            program = {}
            program.id = result.id
            program.thumbs = `http://${util.getConfig().epgrecConfig.host}/thumbs/${path.basename(result.path.toString('UTF-8'))}.jpg`
            if(typeof videoPaths[result.id] == "undefined" || videoPaths[result.id].vide_status != 2) {
                program.videLink = "javascript:openVideoNotFoundDialog()"
            } else if(ua.indexOf('ipad') != -1 || ua.indexOf('ipod') != -1 || ua.indexOf('iphone') != -1) {
                program.videLink = `vlc://${videoPaths[result.id].path}`
            } else {
                program.videLink = `http://${videoPaths[result.id].path}`
            }
            program.title = result.title
            program.info = `${getDateStr(result.starttime)} ${channelName[result.channel_id]}`
            program.description = result.description
            programs.push(program)
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

function epgrecRecordedTag(response, parsedUrl) {
    log.access.info("Request handler 'epgrec recorded tag' was called.");

    var viewFunction = {
        "KW" : { "sql" : sqlModel.getRecordedKeywordList, "view" : keywordTagView },
        "CH" : { "sql" : sqlModel.getRecordedChannelList, "view" : channelTagView }
    };

    var type;
    if(typeof parsedUrl.query.type == "undefined") { type = "KW"; }
    else { type = parsedUrl.query.type; }

    if(typeof viewFunction[type] == "undefined") { notFound(response); return; }
    viewFunction[type].sql(function(results) { viewFunction[type].view(response, parsedUrl, results) });
}

function keywordTagView(response, parsedUrl, results) {
    if(results == '') { notFound(response); return; }

    var keywordList = {}
    results[0].forEach(function(result) {
        keywordList[result.id] = { "keyword" : result.keyword, "cnt" : 0 }
    });
    keywordList[0] = { "keyword" : "予約語なし", "cnt" : 0 }

    results[1].forEach(function(result) {
        //autorec == keyword.id
        if(typeof keywordList[result.autorec] == "undefined") {
            keywordList[0].cnt += 1;
        } else {
            keywordList[result.autorec].cnt += 1;
        }
    });

    //ページ番号
    var num;
    if(typeof parsedUrl.query.num == "undefined" || parsedUrl.query.num < 2) {
        num = 1;
    } else {
        num = Number(parsedUrl.query.num);
    }
    var min = (num - 1) * 15;
    var max = num * 15;
    var i = 0;
    var keywords = [];

    for (var key in keywordList) {
        if(i >= min && i < max) {
            keywords.push({ "autorec" : key, "keyword" : keywordList[key].keyword, "cnt" : keywordList[key].cnt });
        }
        i += 1;
    }

    viewer.epgrecRecordedKeywordsTag(response, keywords);
}

function channelTagView(response, parsedUrl, results) {
    if(results == '') { notFound(response); return; }

    var channelList = {}
    results[0].forEach(function(result) {
        channelList[result.id] = { "channelName" : result.name, "cnt" : 0 }
    });


    results[1].forEach(function(result) {
        channelList[result.channel_id].cnt += 1;
    });

    //ページ番号
    var num;
    if(typeof parsedUrl.query.num == "undefined" || parsedUrl.query.num < 2) {
        num = 1;
    } else {
        num = Number(parsedUrl.query.num);
    }
    var min = (num - 1) * 15;
    var max = num * 15;
    var i = 0;
    var channels = [];

    for (var key in channelList){
        if(channelList[key].cnt != 0) {
            if(i >= min && i < max) {
                channels.push({ "channel_id" : key, "channelName" : channelList[key].channelName, "cnt" : channelList[key].cnt });
            }
            i += 1;
        }
    }

    viewer.epgrecRecordedChannelTag(response, channels);
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
exports.epgrecRecordedTag = epgrecRecordedTag;

