var fs = require('fs');
var spawn = require('child_process').spawn;
var util = require(__dirname + "/util");
var log = require(__dirname + "/logger").getLogger();
var ffmpegManager = require(__dirname + "/ffmpegManager");
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

function addStreamHash(streamNumber, channelName, channel, sid,  intervalId, ffmpegChild, recChild) {
    streamHashs[streamNumber] =  { "channelName" : channelName, "channel" : channel, "sid" : sid, "intervalId" : intervalId, "ffmpegChild" : ffmpegChild, "recChild" : recChild };
}

function childProcessExit(name, streamNumber, child, code, signal) {
    if(!changeChannelHash[streamNumber]) {
        log.stream.debug(name + "code:" + code + " signal:" + signal);
        child.kill('SIGKILL'); //念のため
        if(code != null) {
            stopStream(streamNumber, true);
        } else {
            stopStream(streamNumber, false);
        }
    } else {
        log.stream.debug("change " + name + "code:" + code + " signal:" + signal);
    }
}

function childProcessPipeError(name, streamNumber, child, err) {
    log.stream.debug(name + 'stream error ' + err);
    if(!changeChannelHash[streamNumber]) {
        log.stream.debug(name + "error err:" + err);
        child.kill('SIGKILL'); //念のため
        stopStream(streamNumber, false);
    } else {
        log.stream.debug("change " + name + " err:" + err);
    }
}

function runCommand(streamNumber, videoConfig, channelName, channel, sid, tunerId) {
    //delete ts files
    deleteTsFiles(streamNumber, 0);

    var tunerConfig = tunerManager.getTunerComand(tunerId, sid, channel).split(" ");
    var tunerCmd = tunerConfig.shift();

    //run ffmpeg rec
    var ffmpegChild = ffmpegManager.runFFmpeg(streamNumber, videoConfig);

    var recChild = spawn(tunerCmd, tunerConfig);
    log.stream.info(`run rec command pid : ${recChild.pid}`);

    recChild.stdout.pipe(ffmpegChild.stdin);

    //sdterr
    ffmpegChild.stderr.on('data', function (data) { log.stream.debug(`ffmpeg: ${data}`); });
    recChild.stderr.on('data', function (data) { log.stream.debug(`rec: ${data}`); });

    //終了した時の処置
    ffmpegChild.on("exit", function (code, signal) { childProcessExit("ffmpegChild", streamNumber, recChild, code, signal) } );
    recChild.on("exit", function (code, signal) { childProcessExit("recChild", streamNumber, ffmpegChild, code, signal) } );

    //pipe エラーで終了した時
    ffmpegChild.stdin.on('error', function (err) { childProcessPipeError("ffmpegChild", streamNumber, recChild, err) } );
    recChild.stdin.on('error', function (err) { childProcessPipeError("recChild", streamNumber, ffmpegChild, err) } );

    var intervalId = setInterval(function() { deleteTsFiles(streamNumber, 20); }, 10000);
    addStreamHash(streamNumber, channelName, channel, sid, intervalId, ffmpegChild, recChild);
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

    clearInterval(streamHashs[streamNumber]["intervalId"]);
    var ffmpegChild = streamHashs[streamNumber]["ffmpegChild"];
    var recChild = streamHashs[streamNumber]["recChild"];
    ffmpegChild.stdout.removeAllListeners('data');
    ffmpegChild.stderr.removeAllListeners('data');
    recChild.stdout.unpipe();
    ffmpegChild.kill('SIGKILL');
    recChild.kill('SIGKILL');

    //delete rm -rf dirPath/*
    deleteTsFiles(streamNumber, 0);

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

function deleteTsFiles(streamNumber, fileNum) {
    var config = util.getConfig();
    var dirPath = config["streamFilePath"];
    files = fs.readdirSync(dirPath);

    var tsFileList = [];
    files.forEach(function(file) {
        if(fileNum == 0 && file.match(".m3u8") && file.match(`stream${streamNumber}`)) {
            tsFileList.push(file);
        }
        if(file.match(".ts") && file.match(`stream${streamNumber}`)) {
            tsFileList.push(file);
        }
    });

    //一応ソート
    tsFileList = tsFileList.sort();

    for(var i = 0; i < tsFileList.length - fileNum; i++) {
        if(typeof tsFileList[i] != "undefined") {
            fs.unlink(`${dirPath}/${tsFileList[i]}`, function (err) {
                //log.stream.error(`unlink error ${tsFileList[i]}`);
                //log.stream.error(err);
            });
            log.stream.info(`deleted ${tsFileList[i]}`);
        }
    };
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

