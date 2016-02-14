var deleteVideoFile = require(__dirname + '/deleteVideoFile');
var getVideoLink = require(__dirname + '/getVideoLink');

module.exports = function(io, socket) {
    deleteVideoFile(io, socket); //video file 削除部分
    getVideoLink(io, socket); //video file 削除部分
}

