var log = require(__dirname + "/../../logger").getLogger();
var util = require(__dirname + "/../../util");
var streamManager = require(__dirname + "/../../streamManager");

module.exports = function(io, socket) {
    //チャンネル状況を取得
    socket.on("getStreamStatus", function (socketid) {
        log.access.info(`socketio 'getStreamStatus' was called.`);

        var streamStatus = streamManager.getStreamStatus();
        var channelStatus = [];
        if(Object.keys(streamStatus).length > 0) {
            for (var key in streamStatus) {
                channelStatus.push({num: key, name: streamStatus[key].channelName});
            }
        }
        io.sockets.emit("resultJumpChannelList", { socketid: socketid, channelStatus: channelStatus });
    });
}

