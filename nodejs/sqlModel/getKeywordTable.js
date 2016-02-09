var mysql = require('mysql');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();
var createSqlConnection = require(__dirname + "/createSqlConnection.js");
var getOffset = require(__dirname + "/getOffset.js");

module.exports = function(limit, queryNum, callback) {
    var jsonConfig = util.getConfig();
    var sql = `select * from ${ jsonConfig["EpgrecRecordName"] }channelTbl; select * from ${ jsonConfig["EpgrecRecordName"] }categoryTbl; select * from ${ jsonConfig["EpgrecRecordName"] }keywordTbl order by id limit ${ limit } offset ${ getOffset(queryNum, limit) }; select count(*) from ${ jsonConfig["EpgrecRecordName"] }keywordTbl;`;

    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql getKeywordTable error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql getKeywordTable data");
        callback(results);
        connection.destroy();
    });
}

