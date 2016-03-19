//commandから呼び出される
function initEpgrecProgramLayout(tvTimeHourLength) {
    var queryDate;
    function getDateFromQuery() {
        if(typeof queryDate != "undefined") { return queryDate; }

        var queryTime = getQuery()["time"];
        if(typeof queryTime == "undefined") {
            var nowDate = new Date();
            queryDate = nowDate.getTime() - (nowDate.getMinutes() * 1000 * 60) - (nowDate.getSeconds() * 1000);
        } else {
            var year = queryTime.substr(0, 4);
            var month = queryTime.substr(4, 2);
            var date = queryTime.substr(6, 2);
            var hour = queryTime.substr(8, 2);
            queryDate = new Date(year, month - 1, date, hour, 0);
        }

        return queryDate;
    }

    function getTimeChildren() { return $("#tv_time_id").find('.time'); }

    //時刻線
    function moveTableNowBars(queryLength) {
        var timeHeight = getTimeChildren()[1].offsetHeight;
        var oldDate = getDateFromQuery();
        var nowDate = new Date().getTime();
        var basPosition = (((nowDate - oldDate) / (1000 * 60)) * (timeHeight / 60) ) + 2;
        if(basPosition > queryLength * timeHeight || basPosition < 0) { basPosition = -100; }
        $('#tableNowBas').css('top', basPosition + 'px');
    }

    //時刻線タイマー
    function timerNowBars() {
        var timerNum = 60000 - new Date().getSeconds() * 1000;
        setTimeout( function() { moveTableNowBars() }, timerNum);
        setTimeout( function() { timerNowBars() }, timerNum);
    }

    //番組表クリック時にダイアログを開くように設定
    function setTvProgramClickDiaalog() {
        $(".tv_program").click(function(element) {
            var stationInfo = programHash[(element.currentTarget.id).replace("prgID_", "")];

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

            $('#info_title').text(stationInfo.title);
            $('#info_station_name').text(channelHash[stationInfo.channel_id].name);
            $('#info_time').text(getTimeStr(stationInfo.starttime) + " ~ " + getTimeStr(stationInfo.endtime));
            $('#info_description').text(stationInfo.description);
            $('#info_prgID').text(element.currentTarget.id.split('_')[1]);
            if(stationInfo.title == "NULL") { return; }
            $("#lnkDialog").click();
        });
    }

    function getTimeStr(str) {
        var d = new Date(str);
        return `${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}:${("0" + d.getSeconds()).slice(-2)}`;
    }

    setTvProgramClickDiaalog();
    moveTableNowBars(tvTimeHourLength);
    timerNowBars();
}

//ダイアログオープン(HTML から呼ばれる)
function openDetailRec(prgID) {
    var stationInfo = programHash[prgID];

    $("#progDialog").popup('close');
    setTimeout(function() { $("#progDetailRecDialog").popup('open'); }, 250);
    $('#detail_rec_station_name').text(channelHash[stationInfo.channel_id].name);

    var startTime = getTimeValue(stationInfo.starttime);
    var endTime = getTimeValue(stationInfo.endtime);

    $("#detail_rec_start_year").val(startTime.year);
    $("#detail_rec_start_month").val(startTime.month);
    $("#detail_rec_start_day").val(startTime.day);
    $("#detail_rec_start_hour").val(startTime.hour);
    $("#detail_rec_start_minute").val(startTime.minute);
    $("#detail_rec_start_second").val(startTime.second);

    $("#detail_rec_end_year").val(endTime.year);
    $("#detail_rec_end_month").val(endTime.month);
    $("#detail_rec_end_day").val(endTime.day);
    $("#detail_rec_end_hour").val(endTime.hour);
    $("#detail_rec_end_minute").val(endTime.minute);
    $("#detail_rec_end_second").val(endTime.second);

    $("#detail_program_id_checkbox").prop("checked", true);
    $("#detail_rec_delete_file").prop("checked", false);
    $("#detail_rec_discontinuity").prop("checked", false);

    $("#rec_genre").val(stationInfo.category_id);
    $("#rec_genre").selectmenu('refresh',true);

    $("#rec_mode").val(recModeDefaultId);
    $("#rec_mode").selectmenu('refresh',true);

    $('#detail_rec_title').val(stationInfo.title);
    $('#detail_rec_title').css("height", "80px");
    $('#detail_rec_description').val(stationInfo.description);
    $('#detail_rec_description').css("height", "80px");
    $('#detail_rec_prgID').text(prgID);
    $('#detail_channel_id').text(stationInfo.channel_id);

    function getTimeValue(timeStr) {
        var d = new Date(timeStr);

        return {"year" : d.getFullYear(), "month" : d.getMonth() + 1, "day": d.getDate(), "hour" : d.getHours(), "minute" : d.getMinutes(), "second" : d.getSeconds()};
    }
}

(function () {
    //スマホの時の表示倍率設定
    if(screen.width < 600) {
        $("meta[name='viewport']").attr('content', 'width=width=device-width,initial-scale=0.70, user-scalable=no');
        $("#header").css("transform", "scale(1.4, 1.4)");
    }

    //window リサイズ
    $(window).resize(function () {
        var headerSize = $("#header").height();
        var stationNameSize = $("#station_name_id").height();
        var program_size = $(window).height() - headerSize - stationNameSize;
        var time_size = $(window).height() - headerSize - stationNameSize + $('#station_name_id').height();
        $(".tv_program_section").css("height", program_size + "px");
        $(".tv_time_section").css("height", time_size + "px");
    });
})();

//局名と時刻と時刻線のスクロール
jQuery(function($) {
    var nav = $('#station_name_id');
    var offset = nav.offset();

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
});

//上にスクロール
$(function() {
    $(".scroll_top_button").on('click',function() {
        $('#tv_program_id').animate({ scrollTop: 0 }, 'swing');
    });
});

