var mysql = require('mysql');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();
var createSqlConnection = require(__dirname + "/createSqlConnection.js");

module.exports = function(id, callback) {
    log.system.info('call sql getRecordedIdVideoPathList');

    var jsonConfig = util.getConfig();
    var sql = `select * from ${ jsonConfig["EpgrecRecordName"] }transcodeTbl where rec_id=${id} order by id;`
    sql +=    `select * from ${ jsonConfig["EpgrecRecordName"] }reserveTbl where id=${id} order by id;`

    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql getRecordedIdVideoPathList error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql getRecordedIdVideoPathList data");
        callback(results);
        connection.destroy();
    });
}

