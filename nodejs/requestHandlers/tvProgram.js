var viewerTvProgram = require(__dirname + "/../viewer/tvProgram");
var sqlModel = require(__dirname + "/../sqlModel");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response, parsedUrl) {
    log.access.info("Request handler 'tvProgram' was called.");
    viewerTvProgram(response);
}

