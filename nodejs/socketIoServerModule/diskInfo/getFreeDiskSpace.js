var exec = require('child_process').exec;
var log = require(__dirname + "/../../logger").getLogger();
var util = require(__dirname + "/../../util");

module.exports = function(io, socket) {
    //チューナー, ビデオサイズ等の設定を取得
    socket.on("getFreeDiskSpace", function (socketid) {
        log.access.info(`socketio 'getFreeDiskSpace' was called.`);
        var videoPath = util.getConfig().epgrecConfig.videoPath;

        exec(`df -BG ${videoPath} | awk -v OFS=, 'NR == 2 {print $2, $4;}'`, function (error, stdout, stderr) {
            if(stdout) {
                var data = stdout.split(',');
                var total = data[0].replace(/[^0-9^\.]/g,"");
                var part = data[1].replace(/[^0-9^\.]/g,"");
                io.sockets.emit("resultFreeDiskSpace", {socketid: socketid, total: total , part: part });
            }
            if(stderr) { log.access.error("disk info exec stderr: " + stderr); }
            if (error !== null) { log.access.error("disk info exec error: " + error); }
        });
    });
}

