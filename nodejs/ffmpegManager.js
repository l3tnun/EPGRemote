var spawn = require('child_process').spawn;
var util = require(__dirname + "/util");
var log = require(__dirname + "/logger").getLogger();

function getFfmpegCommand(streamNumber, videoConfig) {
    var config = util.getConfig();
    var ffmpegConfig = config["ffmpeg"]["command"];
    var streamDirPath = config["streamFilePath"];
    var ffpresetPath = config["ffpresetPath"];

    ffmpegConfig = ffmpegConfig.replace("<audioMode>", videoConfig["audioMode"]);
    ffmpegConfig = ffmpegConfig.replace(/<streamNum>/g, streamNumber);
    ffmpegConfig = ffmpegConfig.replace("<ab>", videoConfig["ab"]);
    ffmpegConfig = ffmpegConfig.replace("<vb>", videoConfig["vb"]);
    ffmpegConfig = ffmpegConfig.replace("<size>", videoConfig["size"]);
    ffmpegConfig = ffmpegConfig.replace("<ffpreset>", ffpresetPath);
    ffmpegConfig = ffmpegConfig.replace(/<streamFilesDir>/g, streamDirPath);
    var ffmpegCmd = ['-c', ffmpegConfig];

    return ffmpegCmd;
}

function runFFmpeg(streamNumber, videoConfig) {
    var ffmpegCmd = getFfmpegCommand(streamNumber, videoConfig);
    var ffmpegChild = spawn('sh', ffmpegCmd);
    log.stream.info(`run ffmpeg command pid : ${ffmpegChild.pid}`);

    return ffmpegChild;
}

exports.runFFmpeg = runFFmpeg;
