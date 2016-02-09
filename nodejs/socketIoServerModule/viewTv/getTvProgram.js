var log = require(__dirname + "/../../logger").getLogger();
var streamManager = require(__dirname + '/../../streamManager');
var sqlModel = require(__dirname + "/../../sqlModel");

module.exports = function(io, socket) {
    //番組情報(1局のみ)を取得
    socket.on("getTvProgram", function (streamNumber) {
        log.access.info(`socketio 'getTvProgram' was called ${streamNumber}`);

        //streamNumberからチャンネル情報を取得
        var streamHash = streamManager.getStreamStatus();
        if(typeof streamHash[streamNumber] == "undefined") {
            log.access.error(`streamHash is empty ${streamNumber}`);
            return;
        }

        //番組情報をsqlから取得
        sqlModel.getNowEpgData(function(result) {
            io.sockets.emit("resultTvProgram", {sqlResult: result, streamNumber: streamNumber});
        }, { channel: streamHash[streamNumber]["channel"], sid: streamHash[streamNumber]["sid"] });
    });
}

