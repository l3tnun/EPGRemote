var log = require(__dirname + "/../..//logger").getLogger();
var epgrecManager = require(__dirname + '/../../epgrecManager');

module.exports = function(io, socket) {
    //予約キャンセル
    socket.on("getCancelRec", function (id) {
        log.access.info("socketio 'getCancelRec' was called.");
        epgrecManager.getCancelRecResult(id, function(result) {
                                            io.sockets.emit("cancelRecResult", {value : result, "id" : id});
                                        });
    });
}

