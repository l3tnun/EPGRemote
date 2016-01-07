var util = require(__dirname + "/util");
var fs = require('fs');
var log = require(__dirname + "/logger").getLogger();

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

exports.deleteFile = deleteFile

