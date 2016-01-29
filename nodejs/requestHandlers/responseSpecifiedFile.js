var viewer = require(__dirname + "/../viewer");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response, parsedUrl, fileTypeHash) {
    log.access.info("Request handler 'responseSpecifiedFile' was called.");
    viewer.responseSpecifiedFile(response, parsedUrl, fileTypeHash);
}

