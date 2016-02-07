var viewerEpgrecRecordedTag = require(__dirname + "/../viewer/epgrecRecordedTag");
var log = require(__dirname + "/../logger").getLogger();
var sqlModel = require(__dirname + "/../sqlModel");
var notFound = require(__dirname + "/notFound");

var viewFunction = {
    "keyword" : { "sql" : sqlModel.getRecordedKeywordList, "id" : "autorec" ,"name" : "keyword", "noId" : "予約言なし" },
    "category" : { "sql" : sqlModel.getRecordedCategoryList, "id" : "category_id" ,"name" : "name_jp", "noId" : "分類なし" },
    "channel" : { "sql" : sqlModel.getRecordedChannelList, "id" : "channel_id", "name" : "name", "noId" : "放送局なし" }
};

module.exports = function(response, parsedUrl) {
    log.access.info("Request handler 'epgrec recorded tag' was called.");

    var type;
    if(typeof parsedUrl.query.type == "undefined") { type = "keyword"; }
    else { type = parsedUrl.query.type; }

    if(typeof viewFunction[type] == "undefined") { notFound(response); return; }
    viewFunction[type].sql(function(results) {
        if(results == '') { notFound(response); return; }
        var tagList = {}
        results[0].forEach(function(result) { tagList[result.id] = { "name" : result[viewFunction[type].name], "cnt" : 0 } });

        results[1].forEach(function(result) {
            if(typeof tagList[result[viewFunction[type].id]] == "undefined" ) {
                tagList[result[viewFunction[type].id]] = { "name" : viewFunction[type].noId, "cnt" : 0 };
            }
            tagList[result[viewFunction[type].id]].cnt += 1;
        });

        var num, endNum, startNum, limit = 15;
        if(typeof parsedUrl.query.num == "undefined") { num = 1; } else { num = Number(parsedUrl.query.num); }
        if(num <= 1) { startNum = 1; } else { startNum = ((num - 1) * limit) + 1; }
        endNum = num * limit;

        var i = 1;
        var tags = [];
        for (var key in tagList) {
            if(tagList[key].cnt != 0) {
                if (i >= startNum && i <= endNum) {
                    tags.push({ "type" : type, "link" : key, "title" : tagList[key].name, "cnt" : tagList[key].cnt });
                }
                i += 1;
            }
        }

        if(typeof parsedUrl.query.num == "undefined") { parsedUrl.query.num = 1; }
        viewerEpgrecRecordedTag(response, tags, tagList[key].cnt, parsedUrl.query.num);
    });
}

