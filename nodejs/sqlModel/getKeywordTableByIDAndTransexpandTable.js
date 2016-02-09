var mysql = require('mysql');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();
var createSqlConnection = require(__dirname + "/createSqlConnection.js");

module.exports = function(id, callback) {
    var jsonConfig = util.getConfig();
    var sql = `select * from ${ jsonConfig["EpgrecRecordName"] }keywordTbl where id=${id}; select * from ${ jsonConfig["EpgrecRecordName"] }transexpandTbl where key_id=${id} order by type_no`;

    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql getKeywordTableByID error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql getKeywordTableByID data");
        callback(results);
        connection.destroy();
    });
}

