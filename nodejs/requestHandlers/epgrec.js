var viewer = require(__dirname + "/../viewer");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response, parsedUrl) {
    log.access.info("Request handler 'epgrec' was called.");
    viewer.epgrec(response);
}

