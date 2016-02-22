var mysql = require('mysql');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();
var createSqlConnection = require(__dirname + "/createSqlConnection.js");

module.exports = function(opionArray, callback) {
    log.system.info('call sql getEPGRecLog');
    var jsonConfig = util.getConfig();
    var options = "";
    for(var i = 0; i < 4; i++) {
        if(opionArray[i]) {
            if(options != "") { options += " or "; }
            options += ` level=${i}`;
        }
    }

    if(options == "") { callback(''); return; }

    var sql = `select * from ${ jsonConfig["EpgrecRecordName"] }logTbl where ${options} order by id desc limit 300;`;
    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql getEPGRecLog error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql getEPGRecLog data");
        callback(results);
        connection.destroy();
    });
}

