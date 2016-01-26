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

function viewTv(response, parsedUrl, postData) {
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

function epgrecRecorded(response, parsedUrl) {
    log.access.info("Request handler 'epgrec recorded' was called.");
    sqlModel.getRecordedList( function(results) {
        if(results == '') { notFound(response); return; }

        var channelName = {}
        results[0].forEach(function(result) {
            channelName[result.id] = result.name
        });

        var programs = []
        results[1].forEach(function(result) {
            program = {}
            program.thumbs = `http://${util.getConfig().epgrecConfig.host}/thumbs/${path.basename(result.path.toString('UTF-8'))}.jpg`
            program.title = result.title
            program.info = `${getDateStr(result.starttime)} ${channelName[result.channel_id]}`
            program.description = result.description
            programs.push(program)
        });
        viewer.epgrecRecorded(response, programs);
    });
}

function getDateStr(d) {
    var days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${("0" + (d.getMonth() + 1)).slice(-2)}/${("0" + d.getDate()).slice(-2)}(${days[d.getDay()]}) ${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}`
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

