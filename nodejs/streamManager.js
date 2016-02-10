var fs = require('fs');
var util = require(__dirname + "/util");
var log = require(__dirname + "/logger").getLogger();
var streamFileManager = require(__dirname + "/streamFileManager");
var ffmpegManager = require(__dirname + "/ffmpegManager");
var recManager = require(__dirname + "/recManager");
var tunerManager = require(__dirname + "/tunerManager");
var exitCallback, errorExitCallback, notifyEnableCallback;
var streamHashs = {};
var changeChannelHash = {}; //チャンネル変更の時に停止させてもsocketioに通知がいかないようにするため

function setExitCallback(callback) {
    exitCallback = callback;
}

function setErrorExitCallback(callback) {
    errorExitCallback = callback;
}

function setNotifyCallback(callback) {
    notifyEnableCallback = callback;
}

function getStreamStatus() {
    return streamHashs;
}

function getEmptyStreamNumber() {
    var maxStreamSize = util.getConfig()["tuners"].length;
    for(var i = 0; i < maxStreamSize; i++) {
        if(typeof streamHashs[i] == "undefined") {
            return i;
        }
    }
}

function addStreamHash(streamNumber, channelName, channel, sid, ffmpegChild, recChild) {
    log.stream.info("add stream hash No." + streamNumber + " channel: " + channelName);
    streamHashs[streamNumber] =  { "channelName" : channelName, "channel" : channel, "sid" : sid, "ffmpegChild" : ffmpegChild, "recChild" : recChild };
}

function childProcessExit(name, streamNumber, code, signal) {
    if(!changeChannelHash[streamNumber]) {
        log.stream.error(name + ' ' + streamNumber + " code:" + code + " signal:" + signal);
        stopStream(streamNumber, (code != null));
    } else {
        log.stream.info("change " + name + ' ' + streamNumber + " code:" + code + " signal:" + signal);
    }
}

function childProcessPipeError(name, streamNumber, err) {
    if(!changeChannelHash[streamNumber]) {
        log.stream.error(name + ' ' + streamNumber + ' stream pipe error ' + err);
        stopStream(streamNumber, false);
    } else {
        log.stream.info("change " + name + ' ' + streamNumber + " err:" + err);
    }
}

function setChildErrorProcessing(child, name, streamNumber) {
    child.on("exit", function (code, signal) { childProcessExit(name, streamNumber, code, signal) } );
    child.stdin.on('error', function (err) { childProcessPipeError(name, streamNumber, err) } );
}

function runCommand(streamNumber, videoConfig, channelName, channel, sid, tunerId) {
    log.stream.info("run stream No." + streamNumber);
    //delete ts files
    streamFileManager.deleteAllFiles(streamNumber);

    //run cmds
    var ffmpegChild = ffmpegManager.runFFmpeg(streamNumber, videoConfig);
    var recChild = recManager.runRec(channel, sid, tunerId);

    recChild.stdout.pipe(ffmpegChild.stdin);

    //エラー終了時の処理
    setChildErrorProcessing(ffmpegChild, "ffmpegChild", streamNumber);
    setChildErrorProcessing(recChild, "recChild", streamNumber);

    //streamFileManager.startDeleteTsFiles(streamNumber);
    addStreamHash(streamNumber, channelName, channel, sid, ffmpegChild, recChild);
}

function startStream(streamNumber, channelName, videoConfig, channel, sid, tunerId) {
    changeChannelHash[streamNumber] = false;
    //stream started
    if(typeof streamHashs[streamNumber] != "undefined") {
        log.stream.info(`stream No.${streamNumber} is started`);
        return;
    }

    runCommand(streamNumber, videoConfig, channelName, channel, sid, tunerId)
}

function changeStream(streamNumber, channelName, videoConfig, channel, sid, tunerId) {
    changeChannelHash[streamNumber] = true;

    stopStream(streamNumber);

    //完全に前のffmpegのファイルが削除できるまで待つ
    setTimeout(function(){
        runCommand(streamNumber, videoConfig, channelName, channel, sid, tunerId);
        changeChannelHash[streamNumber] = false;
    },500);
}

function stopStream(streamNumber, code) {
    if(typeof streamHashs[streamNumber] == "undefined") {
      log.stream.warn(`not runnning No.${streamNumber}`);
      return;
    }

    //streamFileManager.stopDelteTsFiles(streamNumber);
    var ffmpegChild = streamHashs[streamNumber]["ffmpegChild"];
    var recChild = streamHashs[streamNumber]["recChild"];
    ffmpegChild.stdout.removeAllListeners('data');
    ffmpegChild.stderr.removeAllListeners('data');
    recChild.stdout.unpipe();
    ffmpegChild.kill('SIGKILL');
    recChild.kill('SIGKILL');

    //delete rm -rf dirPath/*
    streamFileManager.deleteAllFiles(streamNumber);

    if(changeChannelHash[streamNumber] == false) {
        delete streamHashs[streamNumber];
        log.stream.info(`stop stream No.${streamNumber}`);

        tunerManager.unlockTuner(streamNumber);
        if(code) {
            errorExitCallback(streamNumber);
        } else {
            exitCallback(streamNumber);
        }
    }
}

//HLS配信の準備が整ったらcallbackが実行される
function streamNotifyEnable(streamNumber) {
    var id = setInterval(function() {
        if(changeChannelHash[streamNumber]) { return; }

        var config = util.getConfig();
        files = fs.readdirSync(config["streamFilePath"]);

        var tsFileCount = 0;
        var m3u8Flag = false;
        files.forEach(function(file) {
            if(file.match(`stream${streamNumber}`)) {
                if(file.match(".m3u8")) { m3u8Flag = true; }
                if(file.match(".ts")) { tsFileCount += 1; }
            }
        });

        if(m3u8Flag && tsFileCount >= 3) {
            clearInterval(id);
            notifyEnableCallback(streamNumber);
        }

    }, 1000);
}

exports.setNotifyCallback = setNotifyCallback;
exports.setExitCallback = setExitCallback;
exports.setErrorExitCallback = setErrorExitCallback;
exports.getEmptyStreamNumber = getEmptyStreamNumber;
exports.getStreamStatus = getStreamStatus;
exports.startStream = startStream;
exports.changeStream = changeStream;
exports.stopStream = stopStream;
exports.streamNotifyEnable = streamNotifyEnable;

