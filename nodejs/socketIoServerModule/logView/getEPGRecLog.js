var log = require(__dirname + "/../../logger").getLogger();
var sqlModel = require(__dirname + "/../../sqlModel");

module.exports = function(io, socket) {
    //ログ取得
    socket.on("getEPGRecLog", function (socketid, info, warning, error, debug) {
        log.access.info(`socketio 'getEPGRecLog.' was called.`);
        sqlModel.getEPGRecLog([info, warning, error, debug], function(results) {
            io.sockets.emit("resultEPGRecLog", { socketid: socketid, results: results });
        });
    });
}

