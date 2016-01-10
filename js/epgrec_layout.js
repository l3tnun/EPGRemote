//テレビ表クリック時のダイアログ表示
function setTvProgramClickDiaalog() {
    $(".tv_program").click(function(element) {
        var pr_info = $('#' + element.currentTarget.id).contents("div");
        var stationInfo = {}
        for(var i = 0; i < pr_info.length; i++) {
            stationInfo[pr_info[i].className] = pr_info[i].innerHTML;
        }

        //予約済みの場合
        var showElement;
        if(element.currentTarget.className.split(" ").indexOf("tv_program_reced") >= 0) {
            $("#info_simple_rec_element").hide();
            showElement = $("#info_simple_rec_cancel_element");
            showElement.show();
        } else {
            $("#info_simple_rec_cancel_element").hide();
            showElement = $("#info_simple_rec_element")
            showElement.show();
        }

        //自動予約書き換え
        if(element.currentTarget.className.split(" ").indexOf("tv_program_freeze") >= 0) {
            showElement.children()[1].innerHTML = "自動予約許可";
        } else {
            showElement.children()[1].innerHTML = "自動予約禁止";
        }

        document.getElementById('info_title').innerHTML = stationInfo["pr_title"];
        document.getElementById('info_station_name').innerHTML = stationInfo["pr_station_name"];
        if(typeof stationInfo["pr_next_time"] == "undefined") {
            document.getElementById('info_time').innerHTML = stationInfo["pr_start"] + " ~ ";
        } else {
            document.getElementById('info_time').innerHTML = stationInfo["pr_start"] + " ~ " + stationInfo["pr_next_time"];
        }
        document.getElementById('info_description').innerHTML = stationInfo["pr_description"];
        document.getElementById('info_prgID').innerHTML = element.currentTarget.id.split('_')[1];
        if(stationInfo["pr_title"] == "NULL") { return; }
        $("#lnkDialog").click();
    });
}

//スマホの時の表示倍率設定
if(screen.width < 600) {
    $("meta[name='viewport']").attr('content', 'width=width=device-width,initial-scale=0.70');
}

//時刻線
var oldDate, basScroll = 0;
function moveTableNowBas() {
    var nowDate = new Date().getTime();
    var basPosition = (((nowDate - oldDate) / (1000 * 60)) * 3) - basScroll + $("#header").height() + $('#station_name_id').height();

    if($("#header").height() + $('#station_name_id').height() > basPosition) {
        $('#tableNowBas').css('top', '-10px');
    } else {
        $('#tableNowBas').css('top', basPosition + 'px');
    }
}

function timerNowBars() {
    var timerNum = 60000 - new Date().getSeconds() * 1000;
    window.setTimeout( "moveTableNowBas()", timerNum);
    window.setTimeout( "timerNowBars()", timerNum);
}

//局名と時刻と時刻線のスクロール
jQuery(function($) {
    var nav = $('#station_name_id'),
    offset = nav.offset();

    //局名を縦スクロール時にトップに固定
    $(window).scroll(function () {
        if($(window).scrollTop() > offset.top) {
            nav.addClass('fixed');
            document.getElementById('empty').innerHTML = '<div id="empty" style="padding-top:' + nav.height() + 'px;"/>';
        } else {
            nav.removeClass('fixed');
            document.getElementById('empty').innerHTML = '<div id="empty" style="padding-top:0px;"/>';
        }
    });

    //番組表と局名を一緒に横スクロール
    $('#tv_program_id').scroll(function(){
        $('#station_name_id').scrollLeft($('#tv_program_id').scrollLeft());
        $('#tv_time_id').scrollTop($('#tv_program_id').scrollTop());
        basScroll = $('#tv_program_id').scrollTop();
        moveTableNowBas();
    });

});

function getQuery() {
    var paramms = location.href.split("?")[1].split("&");
    var query = {};

    for(var i = 0; i < paramms.length; i++) {
        var para = paramms[i].split("=");
        query[para[0]] = para[1];
    }

    return query;
}

//番組表のサイズ
$(document).ready(function () {
    var headerSize = $("#header").height();
    var stationNameSize = $("#station_name_id").height();
    var program_size = $(window).height() - headerSize - stationNameSize;
    var time_size = $(window).height() - headerSize - stationNameSize + $('#station_name_id').height();
    $(".tv_program_section").css("height", program_size + "px");
    $(".tv_time_section").css("height", time_size + "px");

    //時刻線処理
    var queryTime = getQuery()["time"];
    if(typeof queryTime == "undefined") {
        var nowDate = new Date();
        oldDate = nowDate.getTime() - (nowDate.getMinutes() * 1000 * 60) - (nowDate.getSeconds() * 1000);
    } else {
        var year = queryTime.substr(0, 4);
        var month = queryTime.substr(4, 2);
        var date = queryTime.substr(6, 2);
        var hour = queryTime.substr(8, 2);
        oldDate = new Date(year, month - 1, date, hour, 0);
    }
});
$(window).resize(function () {
    var headerSize = $("#header").height();
    var stationNameSize = $("#station_name_id").height();
    var program_size = $(window).height() - headerSize - stationNameSize;
    var time_size = $(window).height() - headerSize - stationNameSize + $('#station_name_id').height();
    $(".tv_program_section").css("height", program_size + "px");
    $(".tv_time_section").css("height", time_size + "px");
});

//上にスクロール
function scrollTopButton() {
    $('#tv_program_id').animate({ scrollTop: 0 }, 'swing');
}

