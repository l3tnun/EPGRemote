var log = require(__dirname + "/../../logger").getLogger();

module.exports = function(io, socket, stopStreamCallback, reloadTunerSetting) {
    //配信停止
    socket.on("clientStopStream", function (streamNumber) {
        log.access.info(`socketio 'clientStopStream' was called ${streamNumber}`);
        stopStreamCallback(streamNumber);
        io.sockets.emit("stopStream", streamNumber);
        reloadTunerSetting();
    });
}

