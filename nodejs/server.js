var http = require("http");
var url = require("url");
var socketio = require(__dirname + "/socketIoServer.js");
var util = require(__dirname + "/util");
var log = require(__dirname + "/logger").getLogger();

function start(route) {
    function onRequest(request, response) {
        var postData = "";

        request.setEncoding("utf8");
        request.on("data", function(chunk) {
            postData += chunk;
        });
        request.on("end", function() {
            route(url.parse(request.url, true), response, request, postData);
        });
    }
    try {
        var server = http.createServer(onRequest).listen(util.getConfig()["serverPort"]);
        log.system.info("Server has started.");
        socketio.start(server);
    } catch(e) {
        log.system.fatal('listen error');
        log.system.fatal(e);
        process.exit();
    }
}

exports.start = start;

