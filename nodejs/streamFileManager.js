var util = require(__dirname + "/util");
var fs = require('fs');
var log = require(__dirname + "/logger").getLogger();

var streamHashs = {};

function deleteFile(streamNumber, fileNum) {
    var config = util.getConfig();
    var dirPath = config["streamFilePath"];
    files = fs.readdirSync(dirPath);

    var tsFileList = [];
    files.forEach(function(file) {
        if(fileNum == 0 && file.match(".m3u8") && file.match(`stream${streamNumber}`)) {
            tsFileList.push(file);
        }
        if(file.match(".ts") && file.match(`stream${streamNumber}`)) {
            tsFileList.push(file);
        }
    });

    //一応ソート
    tsFileList = tsFileList.sort();

    for(var i = 0; i < tsFileList.length - fileNum; i++) {
        if(typeof tsFileList[i] != "undefined") {
            fs.unlink(`${dirPath}/${tsFileList[i]}`, function (err) {
                //log.stream.error(`unlink error ${tsFileList[i]}`);
                //log.stream.error(err);
            });
            log.stream.info(`deleted ${tsFileList[i]}`);
        }
    };
}

function deleteAllFiles(streamNumber) {
    deleteFile(streamNumber, 0);
}

function startDeleteTsFiles(streamNumber) {
    var intervalId = setInterval(function() { deleteFile(streamNumber, 20); }, 10000);
    streamHashs[streamNumber] = intervalId;
}

function stopDelteTsFiles(streamNumber) {
    clearInterval(streamHashs[streamNumber]);
}

exports.deleteAllFiles = deleteAllFiles
exports.startDeleteTsFiles = startDeleteTsFiles;
exports.stopDelteTsFiles = stopDelteTsFiles;

