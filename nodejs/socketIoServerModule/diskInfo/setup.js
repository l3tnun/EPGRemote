var getFreeDiskSpace = require(__dirname + '/getFreeDiskSpace');

module.exports = function(io, socket) {
    getFreeDiskSpace(io, socket); //ディスクの空き容量を取得
}

