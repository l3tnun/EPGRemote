var log = require(__dirname + "/../../logger").getLogger();
var util = require(__dirname + '/../../util');
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

            io.sockets.emit("resultEPGRecProgramList", { socketid: socketid, recMode: config.epgrecConfig.recMode, recModeDefaultId: config.epgrecConfig.recModeDefaultId, genrus: sqlResult[0], recordedPrograms: recordedPrograms });

            var maxTimeHeight = 180 * length;
            var topTime = new Date(`${time.substr(0,4)}-${time.substr(4,2)}-${time.substr(6,2)}T${time.substr(8,2)}:00:00+0900`);
            var endTime = new Date(topTime.getTime() + (length * 1000 * 60 * 60) );
            var stationNameCnt = 0;
            var heightCount = 0;

            sqlResult[1].forEach(function(channel) {
                if(typeof programs[channel.id] == "undefined" ) { return; }
                stationNameCnt += 1;

                var stationNameHash = {id: channel.id, sid: channel.sid, channel: channel.channel, name: channel.name }
                var programArray = []
                programs[channel.id].forEach(function(program) {
                    if(heightCount == 0 && new Date(program.starttime) > topTime) {
                        var emptyHeight = (new Date(program.starttime).getTime() - topTime.getTime()) / 1000 / 60 * 3;
                        var dummyProgram = {id: -1, height: emptyHeight};
                        heightCount += emptyHeight;
                        programArray.push(dummyProgram);
                    }

                    var height = getProgramHeight(program, topTime, endTime);
                    program.height = height;
                    programArray.push(program);
                    heightCount += height;
                });

                if(maxTimeHeight > heightCount) {
                    var emptyHeight = maxTimeHeight - heightCount;
                    var dummyProgram = {id: -1, height: emptyHeight};
                    programArray.push(dummyProgram);
                }

                io.sockets.emit("HashOfEPGProgramData", { socketid: socketid, stationNameHash: stationNameHash, programArray: programArray, time: time, length: length, type: type });
            });

            io.sockets.emit("finishEPGProgramDataSend", { socketid: socketid, stationNameCnt: stationNameCnt } );
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
