var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response) {
    log.access.info("viewer 'badRequest' was called.");
    response.writeHead(400, {"Content-Type": "text/plain"});
    response.write("400 Bad Request\n");
    response.end();
}

