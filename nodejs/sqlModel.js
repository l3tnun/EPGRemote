var mysql = require('mysql');
var util = require(__dirname + "/util");
var log = require(__dirname + "/logger").getLogger();

function getNowEpgData(callback, hash) {
    var jsonConfig = util.getConfig();

    var otherCondition = "";
    if(typeof hash != "undefined") {
        if(typeof hash["type"] != "undefined") {
            otherCondition += ` and type = '${hash["type"]}'`;
        }
        if(typeof hash["channel"] != "undefined") {
            otherCondition += ` and channel = '${hash["channel"]}'`;
        }
    }

    var sql = `select name, ${jsonConfig["EpgrecRecordName"]}channelTbl.type, sid, ${jsonConfig["EpgrecRecordName"]}channelTbl.channel, ${jsonConfig["EpgrecRecordName"]}channelTbl.channel_disc, title, starttime, endtime, description from ${jsonConfig["EpgrecRecordName"]}channelTbl inner join (select * from ${jsonConfig["EpgrecRecordName"]}programTbl where starttime <= now() and endtime >= now() ${otherCondition}) as programTbl on ${jsonConfig["EpgrecRecordName"]}channelTbl.channel_disc = programTbl.channel_disc order by sid;`;

    var connection = mysql.createConnection(jsonConfig["EpgrecDatabaseCpnfig"]);
    log.system.info("access datebase");

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql error is : ', err );
            callback('');
            return;
        }

        log.system.debug("get sql data");
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

exports.getNowEpgData = getNowEpgData;

