var getJumpChannelConfig = require(__dirname + '/getJumpChannelConfig');
var getTvProgramList = require(__dirname + '/getTvProgramList');
var getStreamStatus = require(__dirname + '/getStreamStatus');
module.exports = function(io, socket, stopStreamCallback, setStopStreamCallback) {
    getJumpChannelConfig(io, socket); //チューナー, ビデオサイズ等の設定を取得
    getTvProgramList(io, socket);//現在放送中の番組表を取得
    getStreamStatus(io, socket);//現在放送中のチャンネルを取得
}

