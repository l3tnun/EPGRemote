var viewerEpgrecSearch = require(__dirname + "/../viewer/epgrecSearch");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response, parsedUrl) {
    log.access.info("Request handler 'epgrec search' was called.");
    viewerEpgrecSearch(response);
}

