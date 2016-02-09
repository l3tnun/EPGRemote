var log = require(__dirname + "/../../logger").getLogger();
 var util = require(__dirname + '/../../util');
var epgrecManager = require(__dirname + '/../../epgrecManager');
var sqlModel = require(__dirname + "/../../sqlModel");

module.exports = function(io, socket) {
    //番組表取得
    socket.on("getEPGRecProgramList", function (socketid, type, length, time) {
        log.access.info(`socketio 'getEPGRecProgramList' was called. ${socketid} ${type} ${length} ${time}`);
        epgrecManager.getProgram(type, length + 1, time, function(body) {
            var json;
            try {
                json = JSON.parse(body);
            } catch(e) {
                log.access.error('getEPGRecProgramList json error');
                log.access.error.log(e);
                return;
            }

            var config = util.getConfig();
            sqlModel.getChannelAndGenru( function(sqlReslut) {
                io.sockets.emit("resultEPGRecProgramList", {"socketid" : socketid, "json" : json , "hourheight" : config.epgrecConfig.hourheight, "genrus" : sqlReslut[0], "channel" : sqlReslut[1], "recMode" : config.epgrecConfig.recMode, "recModeDefaultId" : config.epgrecConfig.recModeDefaultId});
            });
        });
    });
}

