var deleteKeyword = require(__dirname + '/deleteKeyword');

module.exports = function(io, socket) {
    deleteKeyword(io, socket); //自動録画キーワード削除部分
}

