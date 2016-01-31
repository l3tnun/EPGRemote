var util = require(__dirname + "/util");
var log = require(__dirname + "/logger").getLogger();
var http = require('http');

function httpGet(url, callback, name) {
    log.system.info('get ' + name + ' rec');

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
        log.system.error('failed ' + name + ' rec')
        log.system.error(e.message); //エラー時
    });
}

function getProgram(type, length, time, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var url = `http://${epgrecConfig["host"]}/${epgrecConfig["index.php"]}?type=${type}&length=${length}&time=${time}`;

    httpGet(url, callback, 'get EPGRec program');
}

function getRecResult(id, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var url = `http://${epgrecConfig["host"]}/simpleReservation.php?program_id=${id}`;

    httpGet(url, callback, 'EPGRec simple');
}

function getCancelRecResult(id, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var url = `http://${epgrecConfig["host"]}/cancelReservation.php?program_id=${id}`;

    httpGet(url, callback, 'get EPGRec cancel rec');
}

function getToggleAutoRec(id, autorec, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var url = `http://${epgrecConfig["host"]}/toggleAutorec.php?program_id=${id}&bef_auto=${autorec}`;

    httpGet(url, callback, 'get EPGRec auto rec');
}

function deleteVideoFile(rec_id, checkbox, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var df = 0;
    if(checkbox) { df = 1; }
    var url = `http://${epgrecConfig["host"]}/cancelReservation.php?reserve_id=${rec_id}&delete_file=${df}&db_clean=1`;

    httpGet(url, callback, 'delete video file ' + rec_id + ' ' + checkbox);
}

function getCancelReservationResult(rec_id, checkbox, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var df = 0;
    if(checkbox) { df = 1; }
    var url = `http://${epgrecConfig["host"]}/cancelReservation.php?reserve_id=${rec_id}&autorec=${df}`;

    httpGet(url, callback, 'cancel reservation result ' + rec_id + ' ' + checkbox);
}

exports.getProgram = getProgram;
exports.getRecResult = getRecResult;
exports.getCancelRecResult = getCancelRecResult;
exports.getToggleAutoRec = getToggleAutoRec;
exports.deleteVideoFile = deleteVideoFile;
exports.getCancelReservationResult = getCancelReservationResult;

