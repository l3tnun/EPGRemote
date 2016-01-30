var notFound = require(__dirname + "/notFound");

module.exports = function(response, str) {
    if(typeof str == "undefined") {
        return notFound(response)
    } else {
        response.writeHead(200,{'content-Type': 'text/html'});
        response.write(str);
        response.end();
    }
}

