var viewerTopPage = require(__dirname + "/../viewer/topPage");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response, parsedUrl) {
    log.access.info("Request handler 'topPage' was called.");
    viewerTopPage(response);
}

