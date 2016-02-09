var log = require(__dirname + "/../logger").getLogger();
var readFile = require(__dirname + "/readFile");
var responseFile = require(__dirname + "/responseFile");

module.exports = function(response) {
    log.access.info("viewer 'viewTvError' was called.");
    var htmlfile = readFile("./HTML/viewtv_error.html");
    responseFile(response, htmlfile);
}

