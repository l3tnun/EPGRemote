var mysql = require('mysql');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();
var createSqlConnection = require(__dirname + "/createSqlConnection.js");
var getOffset = require(__dirname + "/getOffset");

module.exports = function(limit, queryNum, callback) {
    log.system.info('call sql getReservationTable');
    var jsonConfig = util.getConfig();
    var sql = `select * from ${ jsonConfig["EpgrecRecordName"] }channelTbl; select * from ${ jsonConfig["EpgrecRecordName"] }reserveTbl where endtime >= now() order by starttime limit ${ limit } offset ${ getOffset(queryNum, limit) }; select count(*) from ${ jsonConfig["EpgrecRecordName"] }reserveTbl where endtime >= now() order by starttime`;

    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql getReservationTable error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql getReservationTable data");
        callback(results);
        connection.destroy();
    });
}

