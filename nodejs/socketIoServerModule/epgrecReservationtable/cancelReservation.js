var log = require(__dirname + "/../..//logger").getLogger();
var epgrecManager = require(__dirname + '/../../epgrecManager');

module.exports = function(io, socket) {
    //録画予約一覧 削除部分
    socket.on("requestCancelReservation", function (rec_id, checkbox) {
        log.access.info("socketio 'requestCancelReservation' was called.");
        epgrecManager.getCancelReservationResult(rec_id, checkbox, function(result) {
                                            io.sockets.emit("resultCancelReservation", result);
                                        });
    });
}

