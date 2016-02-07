var log = require(__dirname + "/../..//logger").getLogger();
var epgrecManager = require(__dirname + '/../../epgrecManager');

module.exports = function(io, socket) {
    //簡易予約
    socket.on("getRec", function (id) {
        epgrecManager.getRecResult(id, function(result) {
                                            io.sockets.emit("recResult", {value : result, "id" : id});
                                        });
    });
}

