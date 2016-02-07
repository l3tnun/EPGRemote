var log = require(__dirname + "/../..//logger").getLogger();
var epgrecManager = require(__dirname + '/../../epgrecManager');

module.exports = function(io, socket) {
    //詳細予約
    socket.on("getCustomRec", function (id, option) {
        epgrecManager.getCustomRecResult(id, option, function(result) {
                                            io.sockets.emit("resultCustomRec", {value : result, "id" : id});
                                        });
    });
}

