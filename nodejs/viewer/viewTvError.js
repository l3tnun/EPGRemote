var readFile = require(__dirname + "/readFile");
var responseFile = require(__dirname + "/responseFile");

module.exports = function(response) {
    var htmlfile = readFile("./HTML/viewtv_error.html");
    responseFile(response, htmlfile);
}

