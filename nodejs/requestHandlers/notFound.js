var viewerNotFound = require(__dirname + "/../viewer/notFound");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response) {
    log.access.info("No request handler found.");
    viewerNotFound(response);
}

