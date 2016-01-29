var viewerTvProgram = require(__dirname + "/../viewer/tvProgram");
var sqlModel = require(__dirname + "/../sqlModel");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response, parsedUrl) {
    log.access.info("Request handler 'tvProgram' was called.");
    sqlModel.getNowEpgData(function(results) {
        log.access.debug("called callback");
        viewerTvProgram(response, results, parsedUrl.query.GR, parsedUrl.query.BS, parsedUrl.query.CS, parsedUrl.query.EX);
    });
}

