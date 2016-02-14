var mysql = require('mysql');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();
var createSqlConnection = require(__dirname + "/createSqlConnection.js");

module.exports = function(id, callback) {
    log.system.info('call sql getTranscodeId');
    var jsonConfig = util.getConfig();
    var sql = `select * from ${ jsonConfig["EpgrecRecordName"] }transcodeTbl where id = ${id};`;
    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql getTranscodeId error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql getTranscodeId data");
        callback(results);
        connection.destroy();
    });
}

