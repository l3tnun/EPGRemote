require(__dirname + "/nodejs/logger").init(__dirname + "/logConfig.json");
require(__dirname + "/nodejs/util").setPath(__dirname);

var server = require(__dirname + "/nodejs/server");
var router = require(__dirname + "/nodejs/route");

server.start(router.route);

