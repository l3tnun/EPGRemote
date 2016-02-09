var log = require(__dirname + "/../..//logger").getLogger();
var epgrecManager = require(__dirname + '/../../epgrecManager');
var sqlModel = require(__dirname + "/../../sqlModel");
var subGenreModel = require(__dirname + "/../../subGenreModel");
var util = require(__dirname + "/../../util");

module.exports = function(io, socket) {
    //検索設定取得部分
    socket.on("getEPGRecSearchSetting", function (socketid) {
        log.access.info(`socketio 'getEPGRecSearchSetting' was called ${socketid}`);
            sqlModel.getChannelAndGenru( function(sqlReslut) {
                var config = util.getConfig();
                io.sockets.emit("resultEPGRecSearchSetting", {"socketid" : socketid, "genrus" : sqlReslut[0], "subGenrus" : subGenreModel.getAllSubGenre(), "channel" : sqlReslut[1], "recMode" : config.epgrecConfig.recMode, "recModeDefaultId" : config.epgrecConfig.recModeDefaultId, "startTranscodeId" : config.epgrecConfig.startTranscodeId });
            });
    });
}

