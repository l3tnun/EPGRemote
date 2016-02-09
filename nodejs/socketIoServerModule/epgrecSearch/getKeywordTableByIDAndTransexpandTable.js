var log = require(__dirname + "/../..//logger").getLogger();
var sqlModel = require(__dirname + '/../../sqlModel');

module.exports = function(io, socket) {
    //キーワード編集のためのオプションを取得
    socket.on("getKeywordTableByIDAndTransexpandTable", function (socketid, id) {
        log.access.info(`socketio 'getKeywordTableByID' was called ${socketid}`);
        sqlModel.getKeywordTableByIDAndTransexpandTable(id, function(sqlReslut) {
            var transexpandTable = [];
            sqlReslut[1].forEach( function(table) {
                table.dir = table.dir.toString('UTF-8');
                transexpandTable.push(table);
            });
            io.sockets.emit("resultKeywordTableByIDAndTransexpandTable", {"socketid" : socketid, "KeywordTable" : sqlReslut[0], "TransexpandTable" : transexpandTable });
        });
    });
}

