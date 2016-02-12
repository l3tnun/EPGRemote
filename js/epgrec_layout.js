//テレビ表クリック時のダイアログ表示
function getStationInfo(id) {
    var pr_info = $('#' + id).contents("div");
    var stationInfo = {}
    for(var i = 0; i < pr_info.length; i++) {
        stationInfo[pr_info[i].className] = pr_info[i].innerHTML;
    }

    return stationInfo;
}

function setTvProgramClickDiaalog() {
    $(".tv_program").click(function(element) {
        var stationInfo = getStationInfo(element.currentTarget.id);

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
        var autorecIndex = $("#info_simple_rec_element").css("display") == "none" ? 1 : 2
        if(element.currentTarget.className.split(" ").indexOf("tv_program_freeze") >= 0) {
            showElement.children()[autorecIndex].innerHTML = "自動許可";
        } else {
            showElement.children()[autorecIndex].innerHTML = "自動禁止";
        }

        $('#info_title').text(stationInfo["pr_title"]);
        $('#info_station_name').text(stationInfo["pr_station_name"]);
        if(typeof stationInfo["pr_next_time"] == "undefined") {
            $('#info_time').text(stationInfo["pr_start"] + " ~ ");
        } else {
            $('#info_time').text(stationInfo["pr_start"] + " ~ " + stationInfo["pr_next_time"]);
        }
        $('#info_description').text(stationInfo["pr_description"]);
        $('#info_prgID').text(element.currentTarget.id.split('_')[1]);
        if(stationInfo["pr_title"] == "NULL") { return; }
        $("#lnkDialog").click();
    });
}

function openTimerDialog() {
    $("#progDetailRecDialog").popup('open');
}

function getTimeValue(timeStr) {
    var array = timeStr.split(" ");
    var date = array[0].split("/");
    var time = array[1].split(":");

    return {"year" : date[0], "month" : date[1], "day": date[2], "hour" : time[0], "minute" : time[1], "second" : time[2]};
}

function openDetailRec(prgID) {
    var stationInfo = getStationInfo("prgID_" + prgID);

    $("#progDialog").popup('close');
    setTimeout("openTimerDialog()", 250);
    $('#detail_rec_station_name').text(stationInfo["pr_station_name"]);

    var startTime = getTimeValue(stationInfo["pr_start"]);
    var endTime = getTimeValue(stationInfo["pr_next_time"]);

    $("#detail_rec_start_year").val(Number(startTime.year));
    $("#detail_rec_start_month").val(Number(startTime.month));
    $("#detail_rec_start_day").val(Number(startTime.day));
    $("#detail_rec_start_hour").val(Number(startTime.hour));
    $("#detail_rec_start_minute").val(Number(startTime.minute));
    $("#detail_rec_start_second").val(Number(startTime.second));

    $("#detail_rec_end_year").val(Number(endTime.year));
    $("#detail_rec_end_month").val(Number(endTime.month));
    $("#detail_rec_end_day").val(Number(endTime.day));
    $("#detail_rec_end_hour").val(Number(endTime.hour));
    $("#detail_rec_end_minute").val(Number(endTime.minute));
    $("#detail_rec_end_second").val(Number(endTime.second));

    $("#detail_program_id_checkbox").prop("checked", true);
    $("#detail_rec_delete_file").prop("checked", false);
    $("#detail_rec_discontinuity").prop("checked", false);

    $("#rec_genre").val(stationInfo["pr_genre"]);
    $("#rec_genre").selectmenu('refresh',true);

    $("#rec_mode").val(recModeDefaultId);
    $("#rec_mode").selectmenu('refresh',true);

    $('#detail_rec_title').val(stationInfo["pr_title"]);
    $('#detail_rec_title').css("height", "80px");
    $('#detail_rec_description').val(stationInfo["pr_description"]);
    $('#detail_rec_description').css("height", "80px");
    $('#detail_rec_prgID').text(prgID);
    $('#detail_channel_id').text(stationInfo["pr_channel_id"]);
}

//スマホの時の表示倍率設定
if(screen.width < 600) {
    $("meta[name='viewport']").attr('content', 'width=width=device-width,initial-scale=0.70, user-scalable=no');
}

//時刻線
var oldDate;
function moveTableNowBas() {
    var nowDate = new Date().getTime();
    var basPosition = (((nowDate - oldDate) / (1000 * 60)) * 3) + 2;
    var queryLength = getQuery().length;
    if(typeof queryLength == "undefined") { queryLength = 18; }
    if(basPosition > queryLength * 180 || basPosition < 0) { basPosition = 0; }
    $('#tableNowBas').css('top', basPosition + 'px');
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
    });

});

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

