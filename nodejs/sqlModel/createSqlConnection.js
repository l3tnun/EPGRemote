var mysql = require('mysql');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function() {
    log.system.info("access datebase");
    var config = util.getConfig()["EpgrecDatabaseCpnfig"]
    config.multipleStatements = true
    return mysql.createConnection(config);
}
