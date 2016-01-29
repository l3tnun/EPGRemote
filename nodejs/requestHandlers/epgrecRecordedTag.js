var viewer = require(__dirname + "/../viewer");
var log = require(__dirname + "/../logger").getLogger();
var createPageNumber = require(__dirname + "/createPageNumber");
var sqlModel = require(__dirname + "/../sqlModel");

module.exports = function(response, parsedUrl) {
    log.access.info("Request handler 'epgrec recorded tag' was called.");

    var viewFunction = {
        "KW" : { "sql" : sqlModel.getRecordedKeywordList, "view" : keywordTagView },
        "CH" : { "sql" : sqlModel.getRecordedChannelList, "view" : channelTagView }
    };

    var type;
    if(typeof parsedUrl.query.type == "undefined") { type = "KW"; }
    else { type = parsedUrl.query.type; }

    if(typeof viewFunction[type] == "undefined") { notFound(response); return; }
    viewFunction[type].sql(function(results) { viewFunction[type].view(response, parsedUrl, results) });
}

function keywordTagView(response, parsedUrl, results) {
    if(results == '') { notFound(response); return; }

    var keywordList = {}
    results[0].forEach(function(result) {
        keywordList[result.id] = { "keyword" : result.keyword, "cnt" : 0 }
    });
    keywordList[0] = { "keyword" : "予約語なし", "cnt" : 0 }

    results[1].forEach(function(result) {
        //autorec == keyword.id
        if(typeof keywordList[result.autorec] == "undefined") {
            keywordList[0].cnt += 1;
        } else {
            keywordList[result.autorec].cnt += 1;
        }
    });

    var pageNum = createPageNumber(parsedUrl.query.num);
    var i = 0;
    var keywords = [];

    for (var key in keywordList) {
        if(i >= pageNum.min && i < pageNum.max) {
            keywords.push({ "autorec" : key, "keyword" : keywordList[key].keyword, "cnt" : keywordList[key].cnt });
        }
        i += 1;
    }

    viewer.epgrecRecordedKeywordsTag(response, keywords);
}

function channelTagView(response, parsedUrl, results) {
    if(results == '') { notFound(response); return; }

    var channelList = {}
    results[0].forEach(function(result) {
        channelList[result.id] = { "channelName" : result.name, "cnt" : 0 }
    });

    results[1].forEach(function(result) {
        channelList[result.channel_id].cnt += 1;
    });

    var pageNum = createPageNumber(parsedUrl.query.num);
    var i = 0;
    var channels = [];

    for (var key in channelList){
        if(channelList[key].cnt != 0) {
            if(i >= pageNum.min && i < pageNum.max) {
                channels.push({ "channel_id" : key, "channelName" : channelList[key].channelName, "cnt" : channelList[key].cnt });
            }
            i += 1;
        }
    }

    viewer.epgrecRecordedChannelTag(response, channels);
}

