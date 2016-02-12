var util = require(__dirname + "/util");
var log = require(__dirname + "/logger").getLogger();
var http = require('http');
var request = require('request');

function httpGet(url, callback, name) {
    log.system.info('http get ' + name);

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
        log.system.error('failed http get ' + name)
        log.system.error(e.message); //エラー時
        callback('');
    });
}

function httpPost(url, callback, option, name) {
    log.system.info('http post ' + name);

    request.post(
        url,
        { form: option },
        function (error, response, body) {
            if (error) {
                log.system.error('failed http post ' + name);
                log.system.error(error);
            }
            callback(body);
        }
    );
}

function getCustomRecResult(rec_id, option, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var url = `http://${epgrecConfig["host"]}/customReservation.php`;

    httpPost(url, callback, option, "get getCustomRecResult");
}

function getRecResult(id, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var url = `http://${epgrecConfig["host"]}/simpleReservation.php?program_id=${id}`;

    httpGet(url, callback, 'get EPGRec rec simple ' + id);
}

function getCancelRecResult(id, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var url = `http://${epgrecConfig["host"]}/cancelReservation.php?program_id=${id}`;

    httpGet(url, callback, 'get EPGRec cancel rec ' + id);
}

function getToggleAutoRec(id, autorec, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var url = `http://${epgrecConfig["host"]}/toggleAutorec.php?program_id=${id}&bef_auto=${autorec}`;

    httpGet(url, callback, 'get EPGRec auto rec ' + id);
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

function getDeleteKeywordResult(id, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var url = `http://${epgrecConfig["host"]}/deleteKeyword.php?keyword_id=${id}`;

    httpGet(url, callback, 'delete keyword result ' + id);
}

function getEPGRecSearch(option, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var url = `http://${epgrecConfig["host"]}/${epgrecConfig["programTable.php"]}`;

    httpPost(url, function(result) {
        var resultArray = [];
        var json = JSON.parse(result);
        json.forEach(function(program) {
            if(program.station_name == 1) { return; }
            program["station_name_str"] = program.station_name.match(/\>.+?\</)[0].substr(1).slice(0, -1);
            var genreStartIndex = program.keyword.indexOf("category_id=");
            program["genre_id"] = Number(program.keyword.substr(genreStartIndex , 16).replace(/[^0-9^\.]/g,""));

            var channelStartIndex = program.keyword.indexOf("station=");
            program["channel_id"] = Number(program.keyword.substr(channelStartIndex , 12).replace(/[^0-9^\.]/g,""));
            resultArray.push(program);
        });
        callback(resultArray);
    }, option, "get getEPGRecSearch");
}

function addEPGRecKeyword(option, callback) {
    var epgrecConfig = util.getConfig()["epgrecConfig"];
    var url = `http://${epgrecConfig["host"]}/${epgrecConfig["keywordTable.php"]}`;

    httpPost(url, callback, option, "get addEPGRecKeyword");
}

exports.getCustomRecResult = getCustomRecResult;
exports.getRecResult = getRecResult;
exports.getCancelRecResult = getCancelRecResult;
exports.getToggleAutoRec = getToggleAutoRec;
exports.deleteVideoFile = deleteVideoFile;
exports.getCancelReservationResult = getCancelReservationResult;
exports.getDeleteKeywordResult = getDeleteKeywordResult;
exports.getEPGRecSearch = getEPGRecSearch;
exports. addEPGRecKeyword = addEPGRecKeyword;

