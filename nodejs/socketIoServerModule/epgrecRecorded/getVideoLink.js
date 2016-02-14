var path = require('path');
var log = require(__dirname + "/../../logger").getLogger();
var util = require(__dirname + "/../../util");
var sqlModel = require(__dirname + "/../../sqlModel");

module.exports = function(io, socket) {
    var configJson = util.getConfig();

    //video file 削除部分
    socket.on("requestVideoLink", function (socketid, rec_id) {
        log.access.info("socketio 'requestVideoLink' was called.");
        sqlModel.getRecordedIdVideoPathList(rec_id, function(results) {
            var videoPaths = [], videoTsDel = false;
            results[0].forEach(function(result) {
                var videoPath = result.path.toString('UTF-8').replace(configJson.epgrecConfig.videoPath, "");
                videoPaths.push({ "video_status" : result["status"], "filename" : path.basename(videoPath), "path" : path.join("/video", videoPath), mode: result.name });
                if(result.ts_del == 0) { videoTsDel = true; }
            });

            //tsファイルのパスを追加
            results[1].forEach(function(result) {
                if(videoTsDel == true || videoPaths.length == 0) {
                    videoPaths.push({ "video_status" : 2, "filename" : result.title + ".ts", "path" : path.join("/video", result.path.toString('utf-8')), mode: "ts" });
                }
            });

            io.sockets.emit("resultDeleteVideoLink", socketid, videoPaths);
        });
    });
}
