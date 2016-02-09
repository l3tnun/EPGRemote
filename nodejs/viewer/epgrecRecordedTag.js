var log = require(__dirname + "/../logger").getLogger();
var readFile = require(__dirname + "/readFile");
var responseFile = require(__dirname + "/responseFile");

module.exports = function(response, keywords, keywordCnt, pageNum) {
    log.access.info("viewer 'epgrecRecordedTag' was called.");
    var tagListStr = ""
    keywords.forEach(function(keyword) {
        if(keyword.cnt == 0) { return; }
        tagListStr += `<li><a href="/epgrec_recorded?${keyword.type}=${keyword.link}" target="_self">`
        tagListStr += `<h3>${keyword.title}</h3>`
        tagListStr += `<span class="ui-li-count">${keyword.cnt}</span></a></li>`
    });

    var htmlfile = readFile("./HTML/epgrecrecordedtag.html");
    htmlfile = htmlfile.replace("@@@TAGLIST@@@", tagListStr);
    htmlfile = htmlfile.replace(/@@@PAGENEXT@@@/g, `<input id="page_next" style="display: none;" value="${(pageNum * 15 - keywordCnt == 0)}"/>`);
    responseFile(response, htmlfile);
}

