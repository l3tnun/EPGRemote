var log = require(__dirname + "/../../logger").getLogger();

module.exports = function(io, socket, stopStreamCallback) {
    //配信停止
    socket.on("clientStopStream", function (streamNumber) {
        log.access.debug(`client stop stream ${streamNumber}`);
        stopStreamCallback(streamNumber);
        io.sockets.emit("stopStream");
    });
}

