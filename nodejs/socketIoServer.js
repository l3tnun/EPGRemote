var socketio = require('socket.io');
var streamManager = require(__dirname + '/streamManager');
var log = require(__dirname + "/logger").getLogger();
var moduleViewTvSetup = require(__dirname + "/socketIoServerModule/viewTv/setup");
var moduleEpgrecProgramSetup = require(__dirname + "/socketIoServerModule/epgrecProgram/setup");
var moduleEpgrecRecordedSetup = require(__dirname + "/socketIoServerModule/epgrecRecorded/setup");
var moduleEpgrecReservationtableSetup = require(__dirname + "/socketIoServerModule/epgrecReservationtable/setup");
var moduleEpgrecKeywordtableSetup = require(__dirname + "/socketIoServerModule/epgrecKeywordtable/setup");
var moduleEpgrecSearchSetup = require(__dirname + "/socketIoServerModule/epgrecSearch/setup");
var moduleLiveStreamSetup = require(__dirname + "/socketIoServerModule/liveStream/setup");

var io;
var stopStreamCallback;

//set callback
streamManager.setNotifyCallback(notifyStreamStatus);
streamManager.setExitCallback(notifyStreamStop);
streamManager.setErrorExitCallback(notifyStreamErrorStop);

function setStopStreamCallback(callback) {
    stopStreamCallback = callback;
}

function start(server) {
    io = socketio.listen(server);
    log.system.info("Socket.io Server has started.");
    io.sockets.on("connection", function (socket) {
        /*viewtv 部分*/
        moduleViewTvSetup(io, socket, stopStreamCallback, setStopStreamCallback);
        /*EPGRec Program 部分*/
        moduleEpgrecProgramSetup(io, socket);
        /*epgrec_recorded 部分*/
        moduleEpgrecRecordedSetup(io, socket);
        /*epgrec_reservationtable 部分*/
        moduleEpgrecReservationtableSetup(io, socket);
        /*epgrec_keywordtable 部分*/
        moduleEpgrecKeywordtableSetup(io, socket);
        /*epgrec_search 部分*/
        moduleEpgrecSearchSetup(io, socket);
        /*ライブ視聴共用部分*/
        moduleLiveStreamSetup(io, socket);
    });
}

function notifyStreamStatus(streamNumber) {
    var streamHash = streamManager.getStreamStatus();
    var resultHash = {};
    for (var key in streamHash){
        resultHash[key] = streamHash[key].channelName;
    }

    io.sockets.emit("enableStream", {streamNumber: streamNumber, streamHash: resultHash});
    log.access.debug(`notify enale stream ${streamNumber}`);
}

function notifyStreamStop(streamNumber) {
    io.sockets.emit("stopStream", {value: streamNumber} );
    log.access.debug(`notify stop stream ${streamNumber}`);
}
function notifyStreamErrorStop(streamNumber) {
    io.sockets.emit("errorStream", {value: streamNumber});
    log.access.debug(`notify error stream ${streamNumber}`);
}

exports.setStopStreamCallback = setStopStreamCallback;
exports.start = start;
exports.notifyStreamStatus = notifyStreamStatus;
exports.notifyStreamErrorStop = notifyStreamErrorStop;
