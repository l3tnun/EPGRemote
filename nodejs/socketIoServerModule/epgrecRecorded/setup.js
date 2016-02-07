var deleteVideoFile = require(__dirname + '/deleteVideoFile');

module.exports = function(io, socket) {
    deleteVideoFile(io, socket); //video file 削除部分
}

