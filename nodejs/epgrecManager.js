var util = require(__dirname + "/util");
var log = require(__dirname + "/logger").getLogger();
var http = require('http');

function getProgram(type, length, time, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var url = `http://${epgrecConfig["host"]}/${epgrecConfig["index.php"]}?type=${type}&length=${length}&time=${time}`;

    log.system.info('get EPGRec program');

    http.get(url, function(res){
        var body = '';
        res.setEncoding('utf8');

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(res){
            callback(body);
        });
    }).on('error', function(e){
        log.system.error('failed get EPGRec program')
        log.system.error(e.message); //エラー時
    });
}
//TODO リファクタリング
function getRecResult(id, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var url = `http://${epgrecConfig["host"]}/simpleReservation.php?program_id=${id}`;

    log.system.info('get EPGRec simple rec');

    http.get(url, function(res){
        var body = '';
        res.setEncoding('utf8');

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(res){
            callback(body);
        });
    }).on('error', function(e){
        log.system.error('failed EPGRec simple rec')
        log.system.error(e.message); //エラー時
    });
}

function getCancelRecResult(id, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var url = `http://${epgrecConfig["host"]}/cancelReservation.php?program_id=${id}`;

    log.system.info('get EPGRec cancel rec');

    http.get(url, function(res){
        var body = '';
        res.setEncoding('utf8');

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(res){
            callback(body);
        });
    }).on('error', function(e){
        log.system.error('failed EPGRec cancel rec')
        log.system.error(e.message); //エラー時
    });
}

function getToggleAutoRec(id, autorec, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var url = `http://${epgrecConfig["host"]}/toggleAutorec.php?program_id=${id}&bef_auto=${autorec}`;

    log.system.info('get EPGRec auto rec');

    http.get(url, function(res){
        var body = '';
        res.setEncoding('utf8');

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(res){
            callback(!autorec);
        });
    }).on('error', function(e){
        log.system.error('failed EPGRec auto rec')
        log.system.error(e.message); //エラー時
    });
}

exports.getProgram = getProgram;
exports.getRecResult = getRecResult;
exports.getCancelRecResult = getCancelRecResult;
exports.getToggleAutoRec = getToggleAutoRec;

