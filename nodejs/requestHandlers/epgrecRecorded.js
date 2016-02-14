var path = require('path');
var viewerEpgrecRecorded = require(__dirname + "/../viewer/epgrecRecorded");
var sqlModel = require(__dirname + "/../sqlModel");
var log = require(__dirname + "/../logger").getLogger();
var notFound = require(__dirname + "/notFound");

module.exports = function(response, parsedUrl, request) {
    log.access.info("Request handler 'epgrec recorded' was called.");
    var ua = JSON.stringify(request.headers['user-agent']).toLocaleLowerCase();
    var searchSQLQuery;

    //検索クエリの組み立て
    if(typeof parsedUrl.query.search != "undefined" && parsedUrl.query.search != '') {
        searchSQLQuery = parsedUrl.query.search.replace(/　/g, " ").trim().replace(/^\s+|\s+$/g,'').replace(/ +/g,' ');
    }

    sqlModel.getRecordedList(15, parsedUrl.query.num, searchSQLQuery, { "autorec" : parsedUrl.query.keyword, "category_id" : parsedUrl.query.category ,"channel_id" : parsedUrl.query.channel }, function(results) {
        if(results == '') { notFound(response); return; }

        //チャンネル名
        var channelName = {}
        results[0].forEach(function(result) {
            channelName[result.id] = result.name
        });

        //録画一覧
        var programs = []
        results[1].forEach(function(result) {
            program = {}
            program.id = result.id
            program.thumbs = `/thumbs/${path.basename(result.path.toString('UTF-8'))}.jpg`;
            program.title = result.title;
            program.info = `${getDateStr(result.starttime)}${getTimeStr(result.starttime)}~${getTimeStr(result.endtime)}(${getDuration(result.starttime, result.endtime)})`;
            program.channel_name = `${channelName[result.channel_id]}`;
            program.description = result.description;
            programs.push(program);
        });

        if(typeof parsedUrl.query.num == "undefined") { parsedUrl.query.num = 1; }
        viewerEpgrecRecorded(response, programs, results[2][0]["count(*)"], parsedUrl.query.num);
    });
}

var days = ['日', '月', '火', '水', '木', '金', '土'];
function getDateStr(d) {
    return `${("0" + (d.getMonth() + 1)).slice(-2)}/${("0" + d.getDate()).slice(-2)}(${days[d.getDay()]}) `;
}

function getTimeStr(d) {
   return `${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}`;
}

function getDuration(d1, d2) {
    return parseInt( (d2.getTime() - d1.getTime()) / 1000 / 60, 10 ) + "分";
}

