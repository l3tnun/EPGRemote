var path = require('path');
var socketio = require('socket.io');
var util = require(__dirname + "/util");
var streamManager = require(__dirname + '/streamManager');
var tunerManager = require(__dirname + "/tunerManager");
var epgrecManager = require(__dirname + '/epgrecManager');
var sqlModel = require(__dirname + "/sqlModel");
var log = require(__dirname + "/logger").getLogger();
var io;

var stopStreamCallback;

//set callback
streamManager.setNotifyCallback(notifyStreamStatus);
streamManager.setExitCallback(notifyStreamStop);
streamManager.setErrorExitCallback(notifyStreamErrorStop);

function setStopStreamCallback(callback) {
    stopStreamCallback = callback;
}

function start(server) {
    io = socketio.listen(server);
    log.system.info("Socket.io Server has started.");
    io.sockets.on("connection", function (socket) {
        //配信停止
        socket.on("clientStopStream", function (streamNumber) {
                log.access.debug(`client stop stream ${streamNumber}`);
                stopStreamCallback(streamNumber);
                io.sockets.emit("stopStream");
        });

        //番組情報(1局のみ)を取得
        socket.on("getTvProgram", function (streamNumber) {
            log.access.debug(`client get tv program ${streamNumber}`);

            //streamNumberからチャンネル情報を取得
            streamHash = streamManager.getStreamStatus();
            if(typeof streamHash[streamNumber] == "undefined") {
                log.access.error(`streamHash is empty ${streamNumber}`);
                return;
            }

            //番組情報をsqlから取得
            sqlModel.getNowEpgData(function(result) {
                io.sockets.emit("resultTvProgram", {sqlResult : result, streamNumber : streamNumber});
            }, { "channel" : streamHash[streamNumber]["channel"], "sid" : streamHash[streamNumber]["sid"] });
        });

        //現在放送中の番組表を取得
        socket.on("getTvProgramList", function (type, id) {
            log.access.debug(`client get tv program list ${type}`);
            sqlModel.getNowEpgData(function(result) {
                io.sockets.emit("resultTvProgramList", {value : result, id : id});
            }, { "type" : type});
        });

        //チャンネル変更
        socket.on("changeChannel", function (streamNumber, name, sid, channel, tunerId, videoSizeId) {
            log.access.debug(`client change channel ${streamNumber} ${name} ${sid} ${channel} ${tunerId} ${videoSizeId}`);
            var configJson = util.getConfig();

            var videoConfig = tunerManager.getVideoConfig(videoSizeId);

            setStopStreamCallback(streamManager.stopStream);

            streamManager.changeStream(streamNumber, name , videoConfig, channel, sid, tunerId);
            streamManager.streamNotifyEnable(streamNumber);

            io.sockets.emit("reloadChangeChannel", {streamNumber: streamNumber});
        });

        //チャンネル変更の設定を取得
        socket.on("getChangeChannelConfig", function (socketId, streamNumber, type) {
            log.access.debug(`client get channel config ${type}`);
            var tunerId = tunerManager.getLockedTunerId(streamNumber);

            var tunerList;
            //tunerのtypeが違う
            if(typeof tunerId == "undefined") {
                tunerList = tunerManager.getActiveTuner(type);
            } else {
                tunerList = tunerManager.getActiveTuner(type, tunerId);
            }
            var videoConfig = tunerManager.getVideoSize();

            io.sockets.emit("resultChangeChannelList", {socketId: socketId, tunerId: tunerId, tunerList: tunerList, videoConfig: videoConfig});
        });

        /*EPGRecの番組表からviewtvへ飛ぶ部分*/
        //チューナー, ビデオサイズ等の設定を取得
        socket.on("getJumpChannelConfig", function (socketId, type) {
            log.access.debug(`client get jump channel config ${type}`);

            var tunerList = tunerManager.getActiveTuner(type);
            var videoConfig = tunerManager.getVideoSize();

            io.sockets.emit("resultJumpChannelList", {socketId: socketId, tunerList: tunerList, videoConfig: videoConfig});
        });

        /*EPGRec 通信部分*/
        //EPGRec から番組表を取得
        socket.on("getEPGRecProgramList", function (socketid, type, length, time) {
            log.access.debug(`getEPGRecProgramList ${socketid} ${type} ${length} ${time}`);
            epgrecManager.getProgram(type, length + 1, time, function(body) {
                var json;
                try {
                    json = JSON.parse(body);
                } catch(e) {
                    log.access.error('getEPGRecProgramList json error');
                    log.access.error.log(e);
                    return;
                }

                sqlModel.getGenru( function(genrus) {
                    io.sockets.emit("resultEPGRecProgramList", {"socketid" : socketid, "json" : json , "hourheight" : util.getConfig()["epgrecConfig"]["hourheight"], "genrus" : genrus, "recMode" : util.getConfig()["epgrecConfig"]["recMode"], "recModeDefaultId" : util.getConfig()["epgrecConfig"]["recModeDefaultId"] });
                });

            });
        });

        socket.on("getRec", function (id) {
            epgrecManager.getRecResult(id, function(result) {
                                                io.sockets.emit("recResult", {value : result});
                                            });
        });

        socket.on("getCancelRec", function (id) {
            epgrecManager.getCancelRecResult(id, function(result) {
                                                io.sockets.emit("cancelRecResult", {value : result});
                                            });
        });

        socket.on("getToggleAutoRec", function (id, autorec) {
            epgrecManager.getToggleAutoRec(id, autorec, function(result) {
                                                io.sockets.emit("autoRecResult", {value : result, id : id});
                                            });
        });

        socket.on("getEpgRecHostName", function () {
            io.sockets.emit("epgRecHostNameResult", {value : util.getConfig()["epgrecConfig"]["host"]});
        });

        /*video file 削除部分*/
        socket.on("requestDeleteVideoFile", function (rec_id, checkbox) {
            epgrecManager.deleteVideoFile(rec_id, checkbox, function(result) {
                                                io.sockets.emit("resultDeleteVideoFile", result);
                                            });
        });

        /*録画予約一覧 削除部分*/
        socket.on("requestCancelReservation", function (rec_id, checkbox) {
            epgrecManager.getCancelReservationResult(rec_id, checkbox, function(result) {
                                                io.sockets.emit("resultCancelReservation", result);
                                            });
        });

        /*自動録画キーワード削除部分*/
        socket.on("requestDeleteKeyword", function (id) {
            epgrecManager.getDeleteKeywordResult(id, function(result) {
                                                io.sockets.emit("resultDeleteKeyword", result);
                                            });
        });
    });

}

function notifyStreamStatus(streamNumber) {
    var streamHash = streamManager.getStreamStatus();
    var resultHash = {};
    for (var key in streamHash){
        resultHash[key] = streamHash[key].channelName;
    }

    io.sockets.emit("enableStream", {streamNumber: streamNumber, streamHash: resultHash});
    log.access.debug(`notify enale stream ${streamNumber}`);
}

function notifyStreamStop(streamNumber) {
    io.sockets.emit("stopStream", {value: streamNumber} );
    log.access.debug(`notify stop stream ${streamNumber}`);
}
function notifyStreamErrorStop(streamNumber) {
    io.sockets.emit("errorStream", {value: streamNumber});
    log.access.debug(`notify error stream ${streamNumber}`);
}

exports.setStopStreamCallback = setStopStreamCallback;
exports.start = start;
exports.notifyStreamStatus = notifyStreamStatus;
exports.notifyStreamErrorStop = notifyStreamErrorStop;
