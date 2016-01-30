var path = require('path')
var util = require(__dirname + "/../util");
var notFound = require(__dirname + "/notFound");
var viewerResponseSpecifiedFile = require(__dirname + "/../viewer/responseSpecifiedFile");
var log = require(__dirname + "/../logger").getLogger();
var sqlModel = require(__dirname + "/../sqlModel");

module.exports = function(response, request, parsedUrl, fileTypeHash) {
    log.access.info("Request handler 'responseVideoFile' was called.");

    var configJson = util.getConfig();
    var uri = parsedUrl.pathname;
    var filename;

    if(uri.match(/videoid/) && path.extname(parsedUrl.pathname) == "." + configJson.RecordedFileExtension) {
        var rec_id = path.basename(uri).replace("videoid", "").split(".")[0];

        if(configJson.RecordedFileExtension == "ts") {
            sqlModel.getRecordedId(rec_id, function(result) {
                if(result == '' || result.length == 0) { notFound(response); return; }

                filename = path.join(configJson.epgrecConfig.videoPath, result[0].path.toString('UTF-8'));
                viewerResponseSpecifiedFile(response, request, filename, fileTypeHash, parsedUrl.query.mode);
            });
        } else {
            sqlModel.getTranscodeId(rec_id, function(result) {
                if(result == '' || result.length == 0) { notFound(response); return; }

                filename = result[0].path.toString('UTF-8');
                viewerResponseSpecifiedFile(response, request, filename, fileTypeHash, parsedUrl.query.mode);
            });
        }

        return;
    } else {
        filename = path.join(configJson.epgrecConfig.videoPath, decodeURIComponent(uri)).replace("/video", "");
    }

    viewerResponseSpecifiedFile(response, request, filename, fileTypeHash, parsedUrl.query.mode);
}

