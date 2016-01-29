var viewer = require(__dirname + "/../viewer");
var log = require(__dirname + "/../logger").getLogger();
var streamManager = require(__dirname + "/../streamManager");

module.exports = function(response, parsedUrl) {
    log.access.info("Request handler 'topPage' was called.");
    viewer.topPage(response, streamManager.getStreamStatus());
}

