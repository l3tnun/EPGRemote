var mysql = require('mysql');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();
var createSqlConnection = require(__dirname + "/createSqlConnection.js");

module.exports = function(rec_id, callback) {
    var jsonConfig = util.getConfig();
    var sql = `select * from ${ jsonConfig["EpgrecRecordName"] }reserveTbl where id = ${rec_id};`;
    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql getTranscodeList error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql getTranscodeList data");
        callback(results);
        connection.destroy();
    });
}

