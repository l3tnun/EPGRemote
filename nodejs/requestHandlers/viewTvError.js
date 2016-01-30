var viewerViewTvError = require(__dirname + "/../viewer/viewTvError");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response, parsedUrl) {
    log.access.info("Request handler 'viewTvError' was called.");
    viewerViewTvError(response);
}

