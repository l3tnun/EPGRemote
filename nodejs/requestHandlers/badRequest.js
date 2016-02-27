var viewerBadRequest = require(__dirname + "/../viewer/badRequest");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response) {
    log.access.error("bad request handler found.");
    viewerBadRequest(response);
}

