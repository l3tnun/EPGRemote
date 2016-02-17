var log = require(__dirname + "/../../logger").getLogger();
var sqlModel = require(__dirname + "/../../sqlModel");

module.exports = function(io, socket) {
    //現在放送中の番組表を取得
    socket.on("getTvProgramList", function (type, id) {
        log.access.info(`socketio 'getTvProgramList' was called ${type}`);
        sqlModel.getNowEpgData(function(result) {
            io.sockets.emit("resultTvProgramList", {value: result, id: id});
         }, { type: type});
    });
}

