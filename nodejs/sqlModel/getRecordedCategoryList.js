var mysql = require('mysql');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();
var createSqlConnection = require(__dirname + "/createSqlConnection.js");

module.exports = function(callback) {
    var jsonConfig = util.getConfig();
    var sql = `select * from ${jsonConfig["EpgrecRecordName"]}categoryTbl; select * from ${jsonConfig["EpgrecRecordName"]}reserveTbl where starttime <= now() order by starttime desc;`;
    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql getRecordedCategoryList error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql getRecordedCategoryList data");
        callback(results);
        connection.destroy();
    });
}

