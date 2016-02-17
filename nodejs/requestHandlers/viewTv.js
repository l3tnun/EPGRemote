var url = require("url");
var fs = require('fs');
var util = require(__dirname + "/../util");
var viewerNotFound = require(__dirname + "/../viewer/notFound");
var viewerViewTv = require(__dirname + "/../viewer/viewTv");
var streamManager = require(__dirname + "/../streamManager");
var tunerManager = require(__dirname + "/../tunerManager");
var io = require(__dirname + "/../socketIoServer");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response, parsedUrl, request, postData) {
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
            viewerNotFound(response, "tuner bin is not found.");
            return;
        }

        io.setStopStreamCallback(streamManager.stopStream);
        if(tunerManager.lockTuner(parsedPostQuery.tuner, streamNumber)) {
            io.reloadTunerSetting();
            viewerViewTv(response, streamNumber);
            streamManager.startStream(streamNumber, parsedPostQuery.channelName , videoConfig, parsedPostQuery.channel, parsedPostQuery.sid, parsedPostQuery.tuner);
            streamManager.streamNotifyEnable(streamNumber);
        } else { //tunerがロックされていた
            viewerNotFound(response, "tuner is locked");
        }
    } else { //すでに配信中のものを見る
        viewerViewTv(response, parsedUrl.query.num);
        setTimeout(function(){
            streamManager.streamNotifyEnable(parsedUrl.query.num);
        },1000);
    }
}

