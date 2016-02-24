var mysql = require('mysql');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();
var createSqlConnection = require(__dirname + "/createSqlConnection.js");
var getOffset = require(__dirname + "/getOffset");

module.exports = function(limit, queryNum, searchSQLQuery, query, callback) {
    log.system.info('call sql getRecordedList');
    var option = "";
    for (var key in query) { if(typeof query[key] != "undefined") { option += `and ${key} = ${query[key]}`; } }
    if(typeof searchSQLQuery != "undefined" && searchSQLQuery.length != 0) {
        option += ` and (${getLikeOptionStr("title", searchSQLQuery)} or ${getLikeOptionStr("description", searchSQLQuery)}) `;
    }

    var jsonConfig = util.getConfig();
    var sql = `select * from ${ jsonConfig["EpgrecRecordName"] }channelTbl;`
    sql +=    `select * from ${ jsonConfig["EpgrecRecordName"] }reserveTbl where starttime <= now() ${ option } order by starttime desc limit ${ limit } offset ${ getOffset(queryNum, limit) };`
    sql +=    `select count(*) from ${ jsonConfig["EpgrecRecordName"] }reserveTbl where starttime <= now() ${ option } order by starttime desc`;

    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql getRecordedList error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql getRecordedList data");
        callback(results);
        connection.destroy();
    });
}

function getLikeOptionStr(field, searchSQLQuery) {
    return `(${field} collate utf8_unicode_ci like "%`
    + searchSQLQuery.replace(/\s+/g, `%") and (${field} collate utf8_unicode_ci like "%`)
    + `%")`;
}

