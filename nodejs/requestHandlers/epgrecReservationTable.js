var path = require('path');
var viewerEpgrecReservationTable = require(__dirname + "/../viewer/epgrecReservationTable");
var sqlModel = require(__dirname + "/../sqlModel");
var log = require(__dirname + "/../logger").getLogger();
var notFound = require(__dirname + "/notFound");

module.exports = function(response, parsedUrl, request, postData) {
    log.access.info("Request handler 'epgrec reservation table' was called.");

    sqlModel.getReservationTable(15, parsedUrl.query.num, function(results) {
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
            program.title = result.title;
            program.time = `${getDateStr(result.starttime, result.endtime)}`;
            program.channelName = `${channelName[result.channel_id]}`;
            program.description = result.description;
            program.type = result.type;
            program.autorec = result.autorec;
            program.program_id = result.program_id;
            programs.push(program);
        });

        viewerEpgrecReservationTable(response, programs, results[2][0]["count(*)"], parsedUrl.query.num);
    });
}

function getDateStr(d1, d2) {
    var days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${("0" + (d1.getMonth() + 1)).slice(-2)}/${("0" + d1.getDate()).slice(-2)}(${days[d1.getDay()]}) ${("0" + d1.getHours()).slice(-2)}:${("0" + d1.getMinutes()).slice(-2)} ~ ${("0" + d2.getHours()).slice(-2)}:${("0" + d2.getMinutes()).slice(-2)}`
}

