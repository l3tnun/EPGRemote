var stopStream = require(__dirname + '/stopStream');
var getTvProgram = require(__dirname + '/getTvProgram');
var changeChannel = require(__dirname + '/changeChannel');
var getChangeChannelConfig = require(__dirname + '/getChangeChannelConfig');

module.exports = function(io, socket, stopStreamCallback, setStopStreamCallback, reloadTunerSetting) {
    stopStream(io, socket, stopStreamCallback, reloadTunerSetting); //配信停止
    getTvProgram(io, socket);//番組情報(1局のみ)を取得
    changeChannel(io, socket, setStopStreamCallback);//チャンネル変更
    getChangeChannelConfig(io, socket);//チャンネル変更の設定を取得
}

