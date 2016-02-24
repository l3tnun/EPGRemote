function getWeekOfDay() {
    var weekofday = 0;
    if($("#week0").prop('checked')) { weekofday += 0x1; }
    if($("#week1").prop('checked')) { weekofday += 0x2; }
    if($("#week2").prop('checked')) { weekofday += 0x4; }
    if($("#week3").prop('checked')) { weekofday += 0x8; }
    if($("#week4").prop('checked')) { weekofday += 0x10; }
    if($("#week5").prop('checked')) { weekofday += 0x20; }
    if($("#week6").prop('checked')) { weekofday += 0x40; }

    return weekofday;
}

function addKeyword() {
    var option  = {
        add_keyword: "1",
        k_use_regexp: $("#use_regexp").prop('checked') ? "1" : "" ,
        k_collate_ci: $("#collate_ci").prop('checked') ? "1" : "" ,
        k_ena_title: $("#enable_title").prop('checked') ? "1" : "" ,
        k_ena_desc: $("#enable_disc").prop('checked') ? "1" : "" ,
        k_search: $("#search").val(),
        k_typeGR: $("#type_gr").prop('checked') ? "1" : "" ,
        k_typeBS: $("#type_bs").prop('checked') ? "1" : "" ,
        k_typeCS: $("#type_cs").prop('checked') ? "1" : "" ,
        k_typeEX: $("#type_ex").prop('checked') ? "1" : "" ,
        k_category: $("#genre").val(),
        k_station: $("#station").val(),
        k_weekofday: getWeekOfDay(),
        k_prgtime: $("#prgtime").val(),
        k_period: $("#period").val(),
        k_sub_genre: $("#sub_genre").val(),
        k_first_genre: $("#first_genre").prop('checked') ? "1" : "" ,
        k_criterion_dura: "0", //DB 上の時間量変動警告
        k_sft_start: $("#sft_start").val(),
        k_sft_end: $("#sft_end").val(),
        autorec_mode: $("#k_autorec_mode").val(),
        k_priority: $("#priority").val(),
        k_split_time: $("#split_time").val(),
        k_directory: $("#directory").val(),
        k_filename: $("#filename").val(),
        k_trans_mode0: $("#trans_mode0").val(),
        k_transdir0: $("#transdir0").val(),
        k_trans_mode1: $("#trans_mode1").val(),
        k_transdir1: $("#transdir1").val(),
        k_trans_mode2: $("#trans_mode2").val(),
        k_transdir2: $("#transdir2").val()
    }

    if($("#kw_enable").prop('checked')) { option.k_kw_enable = "1"; }
    if($("#overlap").prop('checked')) { option.k_overlap = "1"; }
    if($("#rest_alert").prop('checked')) { option.k_rest_alert = "1"; }
    if($("#criterion_enab").prop('checked')) { option.k_criterion_enab = "1"; }
    if($("#discontinuity").prop('checked')) { option.k_discontinuity = "1"; }
    if($("#auto_del").prop('checked')) { option.k_auto_del = "1"; }

    var query = getQuery();
    if(typeof query.keyword_id != "undefined") {
        option.keyword_id = query.keyword_id;
    } else {
        option.keyword_id = "0";
    }

    socketio.emit("addEPGRecKeyword", socketid, option);
}

//自動予約キーワード追加、更新
socketio.on("resultAddEPGRecKeyword", function(data) {
    if(data.socketid != socketid) {
        if(typeof getQuery().keyword_id != "undefined") { location.reload(); }
        else { getEPGRecSearchResult(); }
        return;
    }

    var query = getQuery();
    if(typeof query.keyword_id != "undefined" || data.json.length > data.count[0]["count(*)"]) {
        location.href = "/epgrec_keyword_table";
    } else {
        $.growl.error({ message: "正常にキーワードの追加ができなかったようです" });
    }
});

//自動予約キーワード削除
socketio.on("resultDeleteKeyword", function(data) {
    if(!data.match(/^error/i)) {
        if(typeof getQuery().keyword_id != "undefined") { location.reload(); }
        else { getEPGRecSearchResult(); }
    }
});

