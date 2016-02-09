var log = require(__dirname + "/../..//logger").getLogger();
var tunerManager = require(__dirname + "/../../tunerManager");

module.exports = function(io, socket) {
    //チューナー, ビデオサイズ等の設定を取得
    socket.on("getJumpChannelConfig", function (socketId, type) {
        log.access.info(`socketio 'getJumpChannelConfig' was called ${type}`);

        var tunerList = tunerManager.getActiveTuner(type);
        var videoConfig = tunerManager.getVideoSize();

        io.sockets.emit("resultJumpChannelList", {socketId: socketId, tunerList: tunerList, videoConfig: videoConfig});
    });
}

