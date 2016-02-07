var search = require(__dirname + '/search');
var searchSetting = require(__dirname + '/searchSetting');
var addKeyword = require(__dirname + '/addKeyword');
var getKeywordTableByIDAndTransexpandTable = require(__dirname + '/getKeywordTableByIDAndTransexpandTable');


module.exports = function(io, socket) {
    search(io, socket); //検索部分
    searchSetting(io, socket); //検索設定取得部分
    addKeyword(io, socket); //自動録画キーワード追加部分
    getKeywordTableByIDAndTransexpandTable(io, socket); //キーワード編集のためのオプションを取得
}

