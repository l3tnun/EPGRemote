var viewerEpgrec = require(__dirname + "/../viewer/epgrec");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response, parsedUrl) {
    log.access.info("Request handler 'epgrec' was called.");
    viewerEpgrec(response);
}

