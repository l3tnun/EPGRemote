var viewerEpgrecLog = require(__dirname + "/../viewer/epgrecLog");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response, parsedUrl) {
    log.access.info("Request handler 'epgrecLog' was called.");
    viewerEpgrecLog(response);
}

