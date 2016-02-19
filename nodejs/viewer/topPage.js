var log = require(__dirname + "/../logger").getLogger();
var readFile = require(__dirname + "/readFile");
var notFound = require(__dirname + "/notFound");
var responseFile = require(__dirname + "/responseFile");

module.exports = function(response) {
    log.access.info("viewer 'topPage' was called.");
    var htmlfile = readFile("/HTML/index.html");
    if(typeof htmlfile == "undefined") { notFound(response, 'file not found'); return; }

    responseFile(response, htmlfile);
}
