var readFile = require(__dirname + "/readFile");
var responseFile = require(__dirname + "/responseFile");
var util = require(__dirname + "/../util");

module.exports = function(response, keywords, keywordCnt, pageNum) {
    var actionId = 0;
    var keywordStr = ""
    keywords.forEach(function(keyword) {
        keyword.editLink = `/epgrec_search?keyword_id=${keyword.id}`;
        var keywordInfoLink = '"javascript:openKeywordInfo(\'' + JSON.stringify(keyword).replace(/"/g, "\\'") + '\')"';
        keywordStr += `<li><a href=${keywordInfoLink} target="_self">`
        keywordStr += `<h3 class="wordbreak">${keyword.keyword}</h3>`
        keywordStr += `</a></li>`
        actionId += 1;
    });

    if(typeof pageNum == "undefined" || pageNum <= 0) { pageNum = 1; }

    var htmlfile = readFile("./HTML/epgreckeywordtable.html");
    htmlfile = htmlfile.replace(/@@@KEYWORD@@@/g, keywordStr);
    htmlfile = htmlfile.replace(/@@@PAGENEXT@@@/g, `<input id="page_next" style="display: none;" value="${(pageNum * 15 - keywordCnt == 0)}"/>`);
    responseFile(response, htmlfile);
}

