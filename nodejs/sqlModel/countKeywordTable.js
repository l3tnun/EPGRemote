var mysql = require('mysql');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();
var createSqlConnection = require(__dirname + "/createSqlConnection.js");

module.exports = function(callback) {
    log.system.info('call sql countKeywordTable');
    var jsonConfig = util.getConfig();
    var sql = `select count(*) from ${ jsonConfig["EpgrecRecordName"] }keywordTbl`;

    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql countKeywordTable error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql countKeywordTable data");
        callback(results);
        connection.destroy();
    });
}

