var log = require(__dirname + "/../..//logger").getLogger();
var epgrecManager = require(__dirname + '/../../epgrecManager');

module.exports = function(io, socket) {
    //録画予約一覧 削除部分
    socket.on("requestCancelReservation", function (id, checkbox, rec_id) {
        log.access.info("socketio 'requestCancelReservation' was called.");
        epgrecManager.getCancelReservationResult(id, checkbox, function(result) {
                                            io.sockets.emit("resultCancelReservation", { result: result, id: id, rec_id, checkbox: checkbox });
                                        });
    });
}

