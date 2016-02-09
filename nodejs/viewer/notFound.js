var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response, str) {
    log.access.info("viewer 'notFound' was called.");
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found\n");
    if(typeof str != "undefined") { response.write(str); }
    response.end();
}

