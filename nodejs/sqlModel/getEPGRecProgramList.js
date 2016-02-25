var mysql = require('mysql');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();
var createSqlConnection = require(__dirname + "/createSqlConnection.js");

module.exports = function(type, length, time, ch, callback) {
    log.system.info('call sql getEPGRecProgramList');
    var channelOption = "";
    var typeOption = "";
    var getMaxProgramTbl = 1;
    if(ch != null) {
        length = 24;
        getMaxProgramTbl = 7;
        channelOption = `channel_disc="${ch}" `
    } else {
        typeOption = `type="${type}"`;
    }

    var jsonConfig = util.getConfig();
    var topTime = new Date(`${time.substr(0,4)}-${time.substr(4,2)}-${time.substr(6,2)} ${time.substr(8,2)}:00:00`);
    var endTime = new Date(topTime.getTime() + (length * 1000 * 60 * 60));
    sql =  `select id, name_jp from ${ jsonConfig["EpgrecRecordName"] }categoryTbl order by id;`;
    sql += `select * from ${ jsonConfig["EpgrecRecordName"] }channelTbl where ${typeOption} ${channelOption} order by sid;`; //チャンネルリスト
    sql += `select program_id from ${ jsonConfig["EpgrecRecordName"] }reserveTbl where complete=0`;//録画済み
    if(ch != null) { sql += ` and ${channelOption};`; } else { sql +=';'; }
    for(var i = 1; i <= getMaxProgramTbl; i++) {
        sql += `select * from ${ jsonConfig["EpgrecRecordName"] }programTbl where ${typeOption} ${channelOption} and endtime > '${getSqlTimeStr(topTime)}' and '${getSqlTimeStr(endTime)}' > starttime order by starttime;`;
        topTime = new Date(topTime.getTime() + (1000 * 60 * 60 * 24));
        endTime = new Date(endTime.getTime() + (1000 * 60 * 60 * 24));
    }

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

