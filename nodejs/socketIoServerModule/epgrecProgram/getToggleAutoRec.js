var log = require(__dirname + "/../..//logger").getLogger();
var epgrecManager = require(__dirname + '/../../epgrecManager');

module.exports = function(io, socket) {
    //自動予約禁止、許可
    socket.on("getToggleAutoRec", function (id, autorec) {
        log.access.info("socketio 'getToggleAutoRec' was called.");
        epgrecManager.getToggleAutoRec(id, autorec, function(result) {
                                            io.sockets.emit("autoRecResult", {value : result, "id" : id, "autorec" : autorec});
                                        });
    });
}

