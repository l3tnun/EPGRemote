var mysql = require('mysql');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();
var createSqlConnection = require(__dirname + "/createSqlConnection.js");

module.exports = function(type, length, time, callback) {
    log.system.info('call sql getEPGRecProgramList');
    var jsonConfig = util.getConfig();
    var topTime = new Date(`${time.substr(0,4)}-${time.substr(4,2)}-${time.substr(6,2)} ${time.substr(8,2)}:00:00`);
    var endTime = new Date(topTime.getTime() + (length * 1000 * 60 * 60));
    sql =  `select id, name_jp from ${ jsonConfig["EpgrecRecordName"] }categoryTbl order by id;`;
    sql += `select * from ${ jsonConfig["EpgrecRecordName"] }channelTbl where type="${type}" order by sid;`; //チャンネルリスト
    sql += `select program_id from ${ jsonConfig["EpgrecRecordName"] }reserveTbl where complete=0;`; //録画済み
    sql += `select * from Recorder_programTbl where type="${type}" and endtime > '${getSqlTimeStr(topTime)}' and '${getSqlTimeStr(endTime)}' > starttime order by starttime;`;

    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql getEPGRecProgramList error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql getEPGRecProgramList data");
        callback(results);
        connection.destroy();
    });
}

function getSqlTimeStr(d) {
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:00:00`;
}

