var getJumpChannelConfig = require(__dirname + '/getJumpChannelConfig');
var getEPGRecProgramList = require(__dirname + '/getEPGRecProgramList');
var getRec = require(__dirname + '/getRec');
var getCustomRec = require(__dirname + '/getCustomRec');
var getCancelRec = require(__dirname + '/getCancelRec');
var getToggleAutoRec = require(__dirname + '/getToggleAutoRec');

module.exports = function(io, socket) {
    /*EPGRecの番組表からviewtvへ飛ぶ部分*/
    getJumpChannelConfig(io, socket); //チューナー, ビデオサイズ等の設定を取得
    /*EPGRec 通信部分*/
    getEPGRecProgramList(io, socket); //番組表取得
    getRec(io, socket); //簡易予約
    getCustomRec(io, socket); //詳細予約
    getCancelRec(io, socket); //予約キャンセル
    getToggleAutoRec(io, socket); //自動予約禁止、許可
}

