var log = require(__dirname + "/../..//logger").getLogger();
var epgrecManager = require(__dirname + '/../../epgrecManager');

module.exports = function(io, socket) {
    //自動録画キーワード削除部分
    socket.on("requestDeleteKeyword", function (id) {
        log.access.info("socketio 'deleteKeyword' was called.");
        epgrecManager.getDeleteKeywordResult(id, function(result) {
                                            io.sockets.emit("resultDeleteKeyword", result);
                                        });
    });
}

