function scrollTopButton() {
    $('html,body').animate({ scrollTop: 0 }, 'swing');
}

//キーワード詳細
function openKeywordInfo(keywordStr) {
    keyword = JSON.parse(keywordStr.replace(/'/g, '"'));
    console.log(keyword);
    var channelType = "";
    if(keyword.typeGR) { channelType += "GR "; }
    if(keyword.typeBS) { channelType += "BS "; }
    if(keyword.typeCS) { channelType += "CS "; }
    if(keyword.typeEX) { channelType += "EX "; }

    $("#keywordDialogKeyword").text("検索語句: " + keyword.keyword);
    $("#keywordDialogOptions").text("検索語句: " + keyword.options);
    $("#keywordDialogChannelType").text("放送波: " + channelType);
    $("#keywordDialogChannelName").text("局名: " + keyword.channelName);
    $("#keywordDialogCategory").text("カテゴリー: " + keyword.categoryName + "(" + keyword.subGenre + ")");
    $("#keywordDialogWeeks").text("曜日: " + keyword.weekofdays);
    $("#keywordDialogTime").text("時間: " + keyword.time);
    $("#keywordDialogPriority").text("優先度: " + keyword.priority);
    $("#keywordDialogDiscontinuity").text("隣接禁止: " + (keyword.discontinuity ? "○" : "☓"));
    $("#keywordDialogSftStart").text("時刻シフト(開始): " + keyword.sft_start);
    $("#keywordDialogSftEnd").text("時刻シフト(終了): " + keyword.sft_end);
    $("#keywordDialogEdit").attr('href', keyword.editLink);
    $('#actionMenu').popup('close');
    $("#keywordInfoDialog").popup('open');
}

$(window).load(function() {
    //pagination処理
    if($('#program_list').children().length == 0) {
        $(".pagination").css("display", "none");
        return;
    } else if($('#program_list').children().length < 15) {
        $(".pagination_next").css("visibility", "hidden");
    }

    var url = window.location.search;
    query = {};
    array  = url.slice(1).split('&');
    for (var i = 0; i < array.length; i++) {
        vars = array[i].split('=');
        query[vars[0]] = vars[1];
    }

    var pathname = window.location.pathname;

    if(typeof query.num == "undefined" || query.num < 2) {
        $(".pagination_prev").css("visibility", "hidden");
        $(".pagination_name").text("ページ1");
        $(".pagination_next").attr("href", pathname + "?num=2")
    } else {
        $(".pagination_name").text("ページ" + query.num);
        $(".pagination_next").attr("href", pathname + "?num=" + (Number(query.num) + 1))
        $(".pagination_prev").attr("href", pathname + "?num=" + (Number(query.num) - 1))
    }
});

