var log = require(__dirname + "/../..//logger").getLogger();
var epgrecManager = require(__dirname + '/../../epgrecManager');

module.exports = function(io, socket) {
    //予約キャンセル
    socket.on("getCancelRec", function (id) {
        epgrecManager.getCancelRecResult(id, function(result) {
                                            io.sockets.emit("cancelRecResult", {value : result, "id" : id});
                                        });
    });
}

