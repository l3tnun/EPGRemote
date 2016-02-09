var log = require(__dirname + "/../..//logger").getLogger();
var epgrecManager = require(__dirname + '/../../epgrecManager');

module.exports = function(io, socket) {
    //video file 削除部分
    socket.on("requestDeleteVideoFile", function (rec_id, checkbox) {
        log.access.info("socketio 'requestDeleteVideoFile' was called.");
        epgrecManager.deleteVideoFile(rec_id, checkbox, function(result) {
                                            io.sockets.emit("resultDeleteVideoFile", result);
                                        });
    });
}

