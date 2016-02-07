var log = require(__dirname + "/../..//logger").getLogger();
var epgrecManager = require(__dirname + '/../../epgrecManager');
var sqlModel = require(__dirname + "/../../sqlModel");

module.exports = function(io, socket) {
    //自動録画キーワード追加部分
    socket.on("addEPGRecKeyword", function (socketid, option) {
        log.access.debug(`getEPGRecSearchResult ${socketid}`);
        sqlModel.countKeywordTable( function(sqlReslut) {
            epgrecManager.addEPGRecKeyword(option, function(result) {
                                                io.sockets.emit("resultAddEPGRecKeyword", {"socketid" : socketid, "count" : sqlReslut, "json" : JSON.parse(result)});
                                            });
        });
    });
}

