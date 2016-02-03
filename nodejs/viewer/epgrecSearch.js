var readFile = require(__dirname + "/readFile");
var notFound = require(__dirname + "/notFound");
var responseFile = require(__dirname + "/responseFile");

module.exports = function(response) {
    var htmlfile = readFile("./HTML/epgrecsearch.html")
    if(typeof htmlfile == "undefined") { notFound(response, 'file not found'); return; }
    responseFile(response, htmlfile);
}

