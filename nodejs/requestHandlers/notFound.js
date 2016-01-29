var viewer = require(__dirname + "/../viewer");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response) {
    log.access.info("No request handler found.");
    viewer.notFound(response);
}

