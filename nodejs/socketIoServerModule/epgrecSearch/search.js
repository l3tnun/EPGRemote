var log = require(__dirname + "/../..//logger").getLogger();
var epgrecManager = require(__dirname + '/../../epgrecManager');

module.exports = function(io, socket) {
    //検索部分
    socket.on("getEPGRecSearch", function (socketid, option) {
        log.access.debug(`getEPGRecSearchResult ${socketid}`);
        epgrecManager.getEPGRecSearch(option, function(result) {
                                            io.sockets.emit("resultEPGRecSearchResult", {"socketid" : socketid, "json" : result});
                                        });
    });
}

