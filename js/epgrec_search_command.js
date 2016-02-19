/*通知*/
function notifyGrowl(title, id) {
    if(typeof searchResultKeyId[id] == "undefined") { return; }
    var station = searchResultKeyId[id];
    $.growl({ title: title, message: station.station_name_str + " " + station.starttime + " " + station.endtime + "(" +  station.duration + ") " + station.title });
}

/*検索*/
function checkedSearchOption() {
    //検索語句
    if(!$("#use_regexp").prop('checked') && !$("#collate_ci").prop('checked') && !$("#enable_title").prop('checked') && !$("#enable_disc").prop('checked') || !$("#use_regexp").prop('checked') && $("#collate_ci").prop('checked') && !$("#enable_title").prop('checked') && !$("#enable_disc").prop('checked')) {
        $("#enable_title").prop('checked', true);
        $("#enable_disc").prop('checked', true);
    } else if($("#use_regexp").prop('checked')) {
        $("#collate_ci").prop('checked', false);
        if(!$("#enable_title").prop('checked') && !$("#enable_disc").prop('checked')) {
            $("#enable_title").prop('checked', true);
            $("#enable_disc").prop('checked', true);
        }
    }

    //曜日
    if(!$("#week0").prop('checked') && !$("#week1").prop('checked') && !$("#week2").prop('checked') && !$("#week3").prop('checked') && !$("#week4").prop('checked') && !$("#week5").prop('checked') && !$("#week6").prop('checked')) {
        $("#week0").prop('checked', true);
        $("#week1").prop('checked', true);
        $("#week2").prop('checked', true);
        $("#week3").prop('checked', true);
        $("#week4").prop('checked', true);
        $("#week5").prop('checked', true);
        $("#week6").prop('checked', true);
    }

    //放送波
    if(!$("#type_gr").prop('checked') && !$("#type_bs").prop('checked') && !$("#type_cs").prop('checked') && !$("#type_ex").prop('checked') ) {
        $("#type_gr").prop('checked', true);
        $("#type_bs").prop('checked', true);
        $("#type_cs").prop('checked', true);
        $("#type_ex").prop('checked', true);
    }
}

function getEPGRecSearchResult() {
    if($("#search").val() == "") {
        $.growl.error({ message: "検索語句が入力されていません" });
        $("#add_keyword_content").css("display", "none");
        $("search_listview").css("display", "none");
        $("#search_listview").empty();
        $("#search_listview").listview('refresh');
        return;
    }

    checkedSearchOption();

    var option  = {
            do_search: "1",
            search: $("#search").val(),
            station: $("#station").val(),
            category_id: $("#genre").val(),
            sub_genre: $("#sub_genre").val(),
            prgtime: $("#prgtime").val(),
            period: $("#period").val()
    };

    if($("#use_regexp").prop('checked')) { option.use_regexp = "1"; }
    if($("#collate_ci").prop('checked')) { option.collate_ci = "1"; }
    if($("#enable_title").prop('checked')) { option.enable_title = "1"; }
    if($("#enable_disc").prop('checked')) { option.enable_disc = "1"; }
    if($("#type_gr").prop('checked')) { option.typeGR = "1"; }
    if($("#type_bs").prop('checked')) { option.typeBS = "1"; }
    if($("#type_cs").prop('checked')) { option.typeCS = "1"; }
    if($("#type_ex").prop('checked')) { option.typeEX = "1"; }
    if($("#week0").prop('checked')) { option.week0 = "1"; }
    if($("#week1").prop('checked')) { option.week1 = "1"; }
    if($("#week2").prop('checked')) { option.week2 = "1"; }
    if($("#week3").prop('checked')) { option.week3 = "1"; }
    if($("#week4").prop('checked')) { option.week4 = "1"; }
    if($("#week5").prop('checked')) { option.week5 = "1"; }
    if($("#week6").prop('checked')) { option.week6 = "1"; }
    if($("#first_genre").prop('checked')) { option.first_genre = "1"; }

    var query = getUrlQuery();
    if(typeof query.keyword_id != "undefined") {
        option.keyword_id = query.keyword_id;
    }

    socketio.emit("getEPGRecSearch", socketid, option);
}

//検索結果の取得
var searchResult, searchResultKeyId, initSearchOption = true;
socketio.on("resultEPGRecSearchResult", function(data) {
    if(socketid != data.socketid) { return; }

    searchResult = data.json;
    searchResultKeyId = {};

    //search_listview
    var liStr = '<li data-role="list-divider">検索結果</li>';
    data.json.forEach(function(program) {
        if(program.station_name == 1) { return; }

        searchResultKeyId[program.id] = program;

        var classStr = 'class="';
        if(program.rec == 1) { classStr += 'recorded '; }
        if(program.autorec == 0) { classStr += 'freeze '; }
        classStr += '"';

        liStr += `<li><a id="prgID_${program.id}" ${classStr} href="javascript:openInfoDialog(${program.id})" target="_self"">`
        liStr += `<h3 class="wordbreak">${program.title}</h3>`;
        liStr += `<p>${program.type}:${program.station_name_str}</p>`;
        liStr += `<p class="wordbreak">${program.date} ${program.starttime}${program.endtime}(${program.duration})</p>`;
        liStr += `<p class="wordbreak">${program.description}</p>`;
        liStr += `</a></li>\n`;
    });
    liStr += '<li data-role="list-divider">自動予約設定</li>'

    $("#search_listview").empty();
    $("#search_listview").append(liStr);
    $("#search_listview").listview('refresh');

    $('html,body').animate({ scrollTop: $("#search_listview").offset().top }, 'swing');
    if(Object.keys(searchResultKeyId).length == 0){
        $.growl.error({ message: "検索結果がありません" });
    } else {
        $.growl({ title: '' , message: Object.keys(searchResultKeyId).length + "件ヒットしました" });
    }

    $("#add_keyword_content").css("display", "block");
    $("search_listview").css("display", "block");

    //自動予約設定 初期化
    if(!initSearchOption) { return; }
    $("#kw_enable").prop('checked', true);
    $("#overlap").prop('checked', false);
    $("#rest_alert").prop('checked', false);
    $("#criterion_enab").prop('checked', false);
    $("#discontinuity").prop('checked', false);
    $("#auto_del").prop('checked', false);
    $("#detail_rec_priority").val('10');
    $("#sft_start").val('');
    $("#sft_end").val('');
    $("#directory").val('');
    $("#filename").val('');
    $("#transdir0").val('');
    $("#transdir1").val('');
    $("#transdir2").val('');
    $("#k_autorec_mode").val(recModeDefaultId);
    $("#trans_mode0").val('0');
    $("#trans_mode1").val('0');
    $("#trans_mode2").val('0');
});

/*ダイアログ閉じる*/
function closeDialogs(id) {
    if(id == programId) {
        $('#infoDialog').popup('close');
        $('#detailRecDialog').popup('close');
        programId = null;

        return true;
    }

    return false;
}

/*簡易予約*/
function rec() {
    socketio.emit("getRec", programId);
}

socketio.on("recResult", function (data) {
    if(typeof searchResultKeyId[data.id] == "undefined") { return; }

    var recv = data.value.match(/error/i);
    if( recv != null ) {
        if(closeDialogs(data.id)) {
            $.growl.error({ message: data.value });
        }
    } else {
        var pt = data.value.split( ':' );
        var r_id = parseInt(pt[0]);
        var tuner = pt[1];
        var reload = parseInt(pt[3]);

        if( reload ) {
            location.reload();
        } else {
            if( r_id ) {
                $('#prgID_' + r_id).addClass('recorded'); //予約背景追加
                searchResultKeyId[r_id].rec = 1;
                notifyGrowl("簡易予約", data.id);
            }
            closeDialogs(data.id);
        }
    }
});

/*詳細予約*/
function customRec() {
    var program_id = 0;
    if($('#detail_program_id_checkbox').prop('checked')) { program_id = programId; }
    var option = {
                    syear: $('#detail_rec_start_year').val(),
                    smonth: $('#detail_rec_start_month').val(),
                    sday: $('#detail_rec_start_day').val(),
                    shour: $('#detail_rec_start_hour').val(),
                    smin: $('#detail_rec_start_minute').val(),
                    ssec: $('#detail_rec_start_second').val(),
                    eyear: $('#detail_rec_end_year').val(),
                    emonth: $('#detail_rec_end_month').val(),
                    eday: $('#detail_rec_end_day').val(),
                    ehour: $('#detail_rec_end_hour').val(),
                    emin: $('#detail_rec_end_minute').val(),
                    esec: $('#detail_rec_end_second').val(),
                    channel_id: $('#detail_channel_id').text(),
                    record_mode: $('#rec_mode').val(),
                    title: $('#detail_rec_title').val(),
                    description: $('#detail_rec_description').val(),
                    category_id: $('#rec_genre').val(),
                    program_id: program_id,
                    discontinuity: ($('#detail_rec_discontinuity').prop('checked') ? "1" : "0"),
                    priority: $('#detail_rec_priority').val(),
                    ts_del: ($('#detail_rec_delete_file').prop('checked') ? "1" : "0")
                 };

    socketio.emit("getCustomRec", programId, option);
}

socketio.on("resultCustomRec", function (data){
    if(typeof searchResultKeyId[data.id] == "undefined") { return; }

    var recv = data.value.match(/error/i);
    if( recv != null ) {
        if(closeDialogs(data.id)) {
            $.growl.error({ message: data.value });
        }
    } else {
        var pt = data.value.split( ':' );
        var r_id = parseInt(pt[0]);
        var tuner = pt[1];
        var reload = parseInt(pt[3]);

        if( reload ) {
            location.reload();
        } else {
            if( r_id ) {
                $('#prgID_' + data.id).addClass('recorded'); //赤枠追加
                notifyGrowl("詳細予約", data.id);
                searchResultKeyId[data.id].rec = 1;
                closeDialogs(data.id);
            }
        }
    }
});

/*予約キャンセル*/
function cancelRec() {
    socketio.emit("getCancelRec", programId);
}

socketio.on("cancelRecResult", function (data) {
    if(typeof searchResultKeyId[data.id] == "undefined") { return; }

    var recv = data.value.match(/error/i);
    if( recv != null ) {
        if(closeDialogs(data.id)) {
            $.growl.error({ message: data.value });
        }
    } else {
        var reload = parseInt(data.value);
        if( reload ) {
            location.reload();
        } else {
            $('#prgID_' + data.id).removeClass('recorded');
            notifyGrowl("予約キャンセル", data.id);
            searchResultKeyId[data.id].rec = 0;
            closeDialogs(data.id);
        }
    }
});

/*自動予約*/
function toggleAutoRec() {
    socketio.emit("getToggleAutoRec", programId, searchResultKeyId[programId].autorec);
}

socketio.on("autoRecResult", function (data){
    if(typeof searchResultKeyId[programId] == "undefined") { return; }
    if(data.autorec) {
        $('#prgID_' + data.id).addClass('freeze');
        searchResultKeyId[programId].autorec = 0;
        notifyGrowl("自動予約禁止", data.id);
    } else {
        $('#prgID_' + data.id).removeClass('freeze');
        searchResultKeyId[programId].autorec = 1;
        notifyGrowl("自動予約許可", data.id);
    }
    closeDialogs(data.id);
});

/*予約一覧から予約削除*/
 socketio.on("resultCancelReservation", function(data) {
    if(!data.result.match(/^error/i) && typeof searchResultKeyId[data.rec_id] != "undefined") {
        $('#prgID_' + data.rec_id).removeClass('recorded');
        notifyGrowl("予約削除", 'prgID_' + data.rec_id);
        searchResultKeyId[data.rec_id].rec = 0;
        if(data.checkbox) {
            $('#prgID_' + data.rec_id).addClass('freeze');
            searchResultKeyId[data.rec_id].autorec = 0;
        } else {
            $('#prgID_' + data.rec_id).removeClass('freeze');
            searchResultKeyId[data.rec_id].autorec = 1;
        }
        closeDialogs(data.rec_id);
    }
});

