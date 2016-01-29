var viewerResponseSpecifiedFile = require(__dirname + "/../viewer/responseSpecifiedFile");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response, parsedUrl, fileTypeHash) {
    log.access.info("Request handler 'responseSpecifiedFile' was called.");
    viewerResponseSpecifiedFile(response, parsedUrl, fileTypeHash);
}

