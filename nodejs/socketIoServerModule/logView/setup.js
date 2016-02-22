var getEPGRecLog = require(__dirname + '/getEPGRecLog.js');

module.exports = function(io, socket) {
    getEPGRecLog(io, socket); //log取得
}

