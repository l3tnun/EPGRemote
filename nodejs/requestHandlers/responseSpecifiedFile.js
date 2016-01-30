var path = require('path');
var util = require(__dirname + "/../util");
var viewerResponseSpecifiedFile = require(__dirname + "/../viewer/responseSpecifiedFile");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response, request, parsedUrl, fileTypeHash) {
    log.access.info("Request handler 'responseSpecifiedFile' was called.");

    var configJson = util.getConfig();
    var uri = parsedUrl.pathname;
    var filename;

    if (uri.match(/streamfiles/)) {
        filename = path.join(configJson["streamFilePath"], path.basename(uri));
    } else if(uri.split(path.sep)[1] == "thumbs" && path.extname(parsedUrl.pathname) == ".jpg") {
        filename = decodeURIComponent(path.join(configJson.epgrecConfig.thumbsPath, path.basename(uri)));
    } else {
        filename = path.join(util.getRootPath(), uri);
    }

    viewerResponseSpecifiedFile(response, request, filename, fileTypeHash);
}

