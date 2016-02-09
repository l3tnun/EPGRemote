var mysql = require('mysql');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();
var createSqlConnection = require(__dirname + "/createSqlConnection.js");

module.exports = function(callback) {
    var jsonConfig = util.getConfig();
    sql = `select id, name_jp from ${ jsonConfig["EpgrecRecordName"] }categoryTbl order by id; select id, sid, channel_disc, name from ${ jsonConfig["EpgrecRecordName"] }channelTbl order by sid`;

    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql getChannelAndGenru error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql getChannelAndGenru data");
        callback(results);
        connection.destroy();
    });
}

