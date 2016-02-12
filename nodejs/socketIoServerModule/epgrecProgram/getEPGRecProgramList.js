var log = require(__dirname + "/../../logger").getLogger();
var util = require(__dirname + '/../../util');
var epgrecManager = require(__dirname + '/../../epgrecManager');
var sqlModel = require(__dirname + "/../../sqlModel");

module.exports = function(io, socket) {
    //番組表取得
    socket.on("getEPGRecProgramList", function (socketid, type, length, time) {
        log.access.info(`socketio 'getEPGRecProgramList' was called. ${socketid} ${type} ${length} ${time}`);

        var config = util.getConfig();
        sqlModel.getEPGRecProgramList(type, length, time, function(sqlResult) {

            var recordedPrograms = {};
            sqlResult[2].forEach(function(recordedProgram) { recordedPrograms[recordedProgram.program_id] = true; });

            var programs = {};
            sqlResult[3].forEach(function(program) {
                if(typeof programs[program.channel_id] == "undefined") { programs[program.channel_id] = []; }
                program["rec"] = (recordedPrograms[program.id] == true);
                programs[program.channel_id].push(program);
            });

            var maxTimeHeight = 180 * length;
            var programHash = {}, channelHash = {};
            var stationNameCnt = 0;
            var programStr = "";
            var stationNameStr = "";
            var topTime = new Date(`${time.substr(0,4)}-${time.substr(4,2)}-${time.substr(6,2)}T${time.substr(8,2)}:00:00+0900`);
            var endTime = new Date(topTime.getTime() + (length * 1000 * 60 * 60) );
            sqlResult[1].forEach(function(channel) {
                if(typeof programs[channel.id] == "undefined" ) { return; }
                stationNameCnt += 1;
                stationNameStr += `<a href="javascript:jumpViewTv('${channel.sid}', '${channel.channel}', '${channel.name}')" class="station_name" style="color: white;">${channel.name}</a>`;

                programStr += '<div class="station">\n';
                programStr += `<div style="height:0px;">\n`
                programStr += `<div class="" style="visibility: hidden;">dummy</div>\n`
                programStr += `</div>\n`;

                var heightCount = 0;
                programs[channel.id].forEach(function(program) {
                    if(heightCount == 0 && new Date(program.starttime) > topTime) {
                        var emptyHeight = (new Date(program.starttime).getTime() - topTime.getTime()) / 1000 / 60 * 3;
                        programStr += `<div id="prgID_${-1}" style="height:${emptyHeight}px;" class="tv_program_freeze">\n`;
                        programStr += `<div class="pr_title"></div>\n`;
                        programStr += `</div>\n`;
                        heightCount += emptyHeight;
                    }

                    var classNameStr = `tv_program ctg_${program.category_id} `
                    if(program.rec) { classNameStr += "tv_program_reced "; }
                    if(program.autorec == 0) { classNameStr += "tv_program_freeze "; }
                    var height = getProgramHeight(program, topTime, endTime);
                    programStr += `<div id="prgID_${program.id}" style="height:${height}px;" class="${classNameStr}">\n`;
                    programStr += `<div class="pr_title">${program.title}</div>\n`;
                    programStr += `<div class="pr_starttime">${getTimeStr(program.starttime)}</div>\n`;
                    programStr += `<div class="pr_description">${program.description}</div>\n`;
                    programStr += `</div>\n`;

                    programHash[program.id] = program;
                    heightCount += height;
                });

                if(maxTimeHeight > heightCount) {
                    var emptyHeight = maxTimeHeight - heightCount;
                    programStr += `<div id="prgID_${-1}" style="height:${emptyHeight}px;" class="tv_program_freeze">\n`;
                    programStr += `<div class="pr_title"></div>\n`;
                    programStr += `</div>\n`;
                }
                programStr += `</div>\n`;

                channelHash[channel.id] = channel;
            });

            io.sockets.emit("resultEPGRecProgramList", { socketid: socketid, hourheight: config.epgrecConfig.hourheight, recMode: config.epgrecConfig.recMode, recModeDefaultId: config.epgrecConfig.recModeDefaultId, genrus: sqlResult[0], htmlVars: {programHash: programHash, channelHash: channelHash, stationNameCnt: stationNameCnt, programStr: programStr, stationNameStr: stationNameStr}, queryTime: time, queryLength: length });
        });
    });
}


function getProgramHeight(program, topTime, endTime) {
    var programStart = new Date(program.starttime);
    var programEnd = new Date(program.endtime);
    var startDate = programStart < topTime ? topTime : programStart;
    var endDate = programEnd > endTime ? endTime : programEnd;

    return height = (endDate.getTime() - startDate.getTime()) / 1000 / 60 * 3;
}

function getTimeStr(str) {
    var d = new Date(str);
    return `${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}:${("0" + d.getSeconds()).slice(-2)}`;
}

