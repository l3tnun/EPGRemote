var path = require('path');
var viewerEpgrecKeywordTable = require(__dirname + "/../viewer/epgrecKeywordTable");
var sqlModel = require(__dirname + "/../sqlModel");
var log = require(__dirname + "/../logger").getLogger();
var notFound = require(__dirname + "/notFound");
var subGenreModel = require(__dirname + "/../subGenreModel");

module.exports = function(response, parsedUrl, request, postData) {
    log.access.info("Request handler 'epgrec keyword table' was called.");

    sqlModel.getKeywordTable(15, parsedUrl.query.num, function(results) {
        if(results == '') { notFound(response); return; }

        //チャンネル名
        var channelName = {}
        results[0].forEach(function(result) {
            channelName[result.id] = result.name
        });
        channelName[0] = "すべて";

        //カテゴリー名
        var categoryName = {}
        results[1].forEach(function(result) {
            categoryName[result.id] = result.name_jp;
        });
        categoryName[0] = "すべて";

        //録画一覧
        var keywords = []
        results[2].forEach(function(result) {
            var keyword = {}
            keyword.id = result.id
            keyword.keyword = result.keyword;
            keyword.options = getOptions(result);
            keyword.kw_enable = result.kw_enable;
            keyword.channelName = `${channelName[result.channel_id]}`;
            keyword.categoryName = `${categoryName[result.category_id]}`;
            keyword.subGenre = `${subGenreModel.getSubGenre(result.category_id, result.sub_genre)}`;
            keyword.typeGR = result.typeGR;
            keyword.typeBS = result.typeBS;
            keyword.typeCS = result.typeCS;
            keyword.typeEX = result.typeEX;
            keyword.weekofdays = getWeeks(result.weekofdays); //曜日
            keyword.time = getTime(result.prgtime, result.period); //開始時間
            keyword.priority = result.priority //優先度
            keyword.sft_start = getSft(result.sft_start);
            keyword.sft_end = getSft(result.sft_end);
            keyword.discontinuity = result.discontinuity //隣接禁止
            keyword.autorec_mode = result.autorec_mode //録画モード
            keywords.push(keyword);
        });

        viewerEpgrecKeywordTable(response, keywords, results[3][0]["count(*)"], parsedUrl.query.num);
    });

}

function getOptions(keyword) {
    var options = "";

    if(keyword.use_regexp) { options += "正"; }
    else if(keyword.collate_ci) { options += "全"; }
    else { options += "－"; }

    if(keyword.ena_title) { options += "タ"; } else { options += "－"; }
    if(keyword.ena_desc) { options += "概"; } else { options += "－"; }

    options += ":";

    if(keyword.overlap) { options += "多"; }
    else if(keyword.split_time) { options += "分"; }
    else { options += "－"; }

    if(keyword.rest_alert) { options += "無"; } else { options += "－"; }
    if(keyword.criterion_dura) { options += "幅"; } else { options += "－"; }

    return options;
}

function getWeeks(weeks) {
    var weeksStr = "";
    if(weeks == 127) { return "-"; }
    if((weeks | 0x1) == weeks) { weeksStr += "月 "; }
    if((weeks | 0x2) == weeks) { weeksStr += "火 "; }
    if((weeks | 0x4) == weeks) { weeksStr += "水 "; }
    if((weeks | 0x8) == weeks) { weeksStr += "木 "; }
    if((weeks | 0x10) == weeks) { weeksStr += "金 "; }
    if((weeks | 0x20) == weeks) { weeksStr += "土 "; }
    if((weeks | 0x40) == weeks) { weeksStr += "日 "; }

    return weeksStr;
}

function getTime(prgtime, period) {
    if(prgtime == 24) {
        return "なし";
    } else {
        return `${prgtime}時〜${period}H`;
    }
}

function getSft(sft_start) {
    var h = sft_start / 3600 | 0;
    var m = sft_start % 3600 / 60 | 0;
    var s = sft_start % 60;

    return `${plusZero(h)}:${plusZero(m)}:${plusZero(s)}`;
}

function plusZero(t) {
    return ('0' + t).slice(-2)
}
