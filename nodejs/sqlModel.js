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

function getChannelAndGenru(callback) {
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

function getOffset(num, limit) {
    if(typeof num == "undefined") { num = 1; } else { num = Number(num); }
    if(num <= 1) { return 0; } else { return (num - 1) * limit; }
}

function getRecordedList(limit, queryNum, searchSQLQuery, query, callback) {
    var option = "";
    for (var key in query) { if(typeof query[key] != "undefined") { option += `and ${key} = ${query[key]}`; } }
    if(typeof searchSQLQuery != "undefined" && searchSQLQuery.length != 0) {
        var titleOption = '(title like "%' + searchSQLQuery.replace(/\s+/g, "%) and (title like %")  + '%")';
        var description = '(description like "%' + searchSQLQuery.replace(/\s+/g, "%) and (description like %")  + '%")';
        option += ` and (${titleOption} or ${description}) `;
    }

    var jsonConfig = util.getConfig();
    var sql = `select * from ${ jsonConfig["EpgrecRecordName"] }channelTbl; select * from ${ jsonConfig["EpgrecRecordName"] }transcodeTbl; select * from ${ jsonConfig["EpgrecRecordName"] }reserveTbl where starttime <= now() ${ option } order by starttime desc limit ${ limit } offset ${ getOffset(queryNum, limit) }; select count(*) from ${ jsonConfig["EpgrecRecordName"] }reserveTbl where starttime <= now() ${ option } order by starttime desc`;

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

function getRecordedKeywordList(callback) {
    var jsonConfig = util.getConfig();
    var sql = `select * from ${jsonConfig["EpgrecRecordName"]}keywordTbl; select * from ${jsonConfig["EpgrecRecordName"]}reserveTbl where starttime <= now() order by starttime desc;`;
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

function getRecordedChannelList(callback) {
    var jsonConfig = util.getConfig();
    var sql = `select * from ${jsonConfig["EpgrecRecordName"]}channelTbl; select * from ${jsonConfig["EpgrecRecordName"]}reserveTbl where starttime <= now() order by starttime desc;`;
    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql getRecordedChannelList error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql getRecordedChannelList data");
        callback(results);
        connection.destroy();
    });
}

function getRecordedCategoryList(callback) {
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

function getTranscodeId(rec_id, callback) {
    var jsonConfig = util.getConfig();
    var sql = `select * from ${ jsonConfig["EpgrecRecordName"] }transcodeTbl where rec_id = ${rec_id};`;
    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql getTranscodeList error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql getTranscodeList data");
        callback(results);
        connection.destroy();
    });
}

function getRecordedId(rec_id, callback) {
    var jsonConfig = util.getConfig();
    var sql = `select * from ${ jsonConfig["EpgrecRecordName"] }reserveTbl where id = ${rec_id};`;
    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql getTranscodeList error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql getTranscodeList data");
        callback(results);
        connection.destroy();
    });
}

function getReservationTable(limit, queryNum, callback) {
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

function getKeywordTable(limit, queryNum, callback) {
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

function countKeywordTable(callback) {
    var jsonConfig = util.getConfig();
    var sql = `select count(*) from ${ jsonConfig["EpgrecRecordName"] }keywordTbl`;

    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql countKeywordTable error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql countKeywordTable data");
        callback(results);
        connection.destroy();
    });
}

function getKeywordTableByIDAndTransexpandTable(id, callback) {
    var jsonConfig = util.getConfig();
    var sql = `select * from ${ jsonConfig["EpgrecRecordName"] }keywordTbl where id=${id}; select * from ${ jsonConfig["EpgrecRecordName"] }transexpandTbl where key_id=${id} order by type_no`;

    var connection = createSqlConnection();

    connection.query(sql, function(err, results) {
        if (err) {
            log.system.error('sql getKeywordTableByID error is : ', err );
            callback('');
            return;
        }

        log.system.debug("sql getKeywordTableByID data");
        callback(results);
        connection.destroy();
    });
}

exports.getNowEpgData = getNowEpgData;
exports.getChannelAndGenru = getChannelAndGenru;
exports.getRecordedList = getRecordedList;
exports.getRecordedKeywordList = getRecordedKeywordList;
exports.getRecordedCategoryList = getRecordedCategoryList;
exports.getRecordedChannelList = getRecordedChannelList;
exports.getTranscodeId = getTranscodeId;
exports.getRecordedId = getRecordedId;
exports.getReservationTable = getReservationTable;
exports.getKeywordTable = getKeywordTable;
exports.countKeywordTable = countKeywordTable;
exports.getKeywordTableByIDAndTransexpandTable = getKeywordTableByIDAndTransexpandTable;

