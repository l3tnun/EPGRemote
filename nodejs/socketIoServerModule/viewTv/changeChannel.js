var log = require(__dirname + "/../../logger").getLogger();
var streamManager = require(__dirname + '/../../streamManager');
var util = require(__dirname + "/../../util");
var tunerManager = require(__dirname + "/../../tunerManager");

module.exports = function(io, socket, setStopStreamCallback) {
    //チャンネル変更
    socket.on("changeChannel", function (streamNumber, name, sid, channel, tunerId, videoSizeId) {
        log.access.info(`socketio 'changeChannel' was called ${streamNumber} ${name} ${sid} ${channel} ${tunerId} ${videoSizeId}`);
        var configJson = util.getConfig();

        var videoConfig = tunerManager.getVideoConfig(videoSizeId);

        setStopStreamCallback(streamManager.stopStream);

        streamManager.changeStream(streamNumber, name , videoConfig, channel, sid, tunerId);
        streamManager.streamNotifyEnable(streamNumber);

        io.sockets.emit("reloadChangeChannel", {streamNumber: streamNumber});
    });
}

