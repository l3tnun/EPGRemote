var mysql = require('mysql');
var util = require(__dirname + "/util");
var log = require(__dirname + "/logger").getLogger();

function createSqlConnection() {
    log.system.info("access datebase");
    var config = util.getConfig()["EpgrecDatabaseCpnfig"]
    config.multipleStatements = true
    return mysql.createConnection(config);
}

function getNowEpgData(callback, hash) {

    var otherCondition = "";
    if(typeof hash != "undefined") {
        if(typeof hash["type"] != "undefined") {
            otherCondition += ` and type = '${hash["type"]}'`;
        }
        if(typeof hash["channel"] != "undefined") {
            otherCondition += ` and channel = '${hash["channel"]}'`;
        }
    }

    var jsonConfig = util.getConfig();
    var sql = `select name, ${jsonConfig["EpgrecRecordName"]}channelTbl.type, sid, ${jsonConfig["EpgrecRecordName"]}channelTbl.channel, ${jsonConfig["EpgrecRecordName"]}channelTbl.channel_disc, title, starttime, endtime, description from ${jsonConfig["EpgrecRecordName"]}channelTbl inner join (select * from ${jsonConfig["EpgrecRecordName"]}programTbl where starttime <= now() and endtime >= now() ${otherCondition}) as programTbl on ${jsonConfig["EpgrecRecordName"]}channelTbl.channel_disc = programTbl.channel_disc order by sid;`;

    var connection = createSqlConnection();
    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql getNowEpgData error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql getNowEpgData data");
        if(typeof hash != "undefined" && typeof hash["sid"] != "undefined") {
            for(var i = 0; i < results.length; i++) {
                if(results[i]["sid"] != hash["sid"]) {
                    delete results[i];
                } else {
                    results[0] = results[i];
                }
            }
        }
        callback(results);
        connection.destroy();
    });
}

function getRecordedList(callback) {
    var jsonConfig = util.getConfig();
    var sql = `select * from ${jsonConfig["EpgrecRecordName"]}channelTbl; select * from ${jsonConfig["EpgrecRecordName"]}transcodeTbl; select * from ${jsonConfig["EpgrecRecordName"]}reserveTbl where complete = 1 order by starttime desc;`;
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

exports.getNowEpgData = getNowEpgData;
exports.getRecordedList = getRecordedList;

