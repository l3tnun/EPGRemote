var log = require(__dirname + "/../../logger").getLogger();
var tunerManager = require(__dirname + "/../../tunerManager");

module.exports = function(io, socket) {
    //チャンネル変更の設定を取得
    socket.on("getChangeChannelConfig", function (socketId, streamNumber, type) {
        log.access.debug(`client get channel config ${type}`);
        var tunerId = tunerManager.getLockedTunerId(streamNumber);

        var tunerList;
        //tunerのtypeが違う
        if(typeof tunerId == "undefined") {
            tunerList = tunerManager.getActiveTuner(type);
        } else {
            tunerList = tunerManager.getActiveTuner(type, tunerId);
        }
        var videoConfig = tunerManager.getVideoSize();

        io.sockets.emit("resultChangeChannelList", {socketId: socketId, tunerId: tunerId, tunerList: tunerList, videoConfig: videoConfig});
    });
}
