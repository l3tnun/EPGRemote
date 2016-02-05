function notifyGrowl(title, id) {
    if(typeof searchResultKeyId[id] == "undefined") { return; }
    var station = searchResultKeyId[id];
    $.growl({ title: title, message: station.station_name_str + " " + station.starttime + " " + station.endtime + "(" +  station.duration + ") " + station.title });
}

function closeDialogs(id) {
    if(id == programId) {
        $('#infoDialog').popup('close');
        $('#detailRecDialog').popup('close');
        programId = null;

        return true;
    }

    return false;
}

function rec() {
    socketio.emit("getRec", programId);
}

socketio.on("recResult", function (data) {
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

function customRec() {
    var program_id = 0;
    if($('#detail_program_id_checkbox').attr('checked')) { program_id = programId; }
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
                    discontinuity: ($('#detail_rec_discontinuity').attr('checked') ? "1" : "0"),
                    priority: $('#detail_rec_priority').val(),
                    ts_del: ($('#detail_rec_delete_file').attr('checked') ? "1" : "0")
                 };

    socketio.emit("getCustomRec", programId, option);
}

socketio.on("resultCustomRec", function (data){
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

function cancelRec() {
    socketio.emit("getCancelRec", programId);
}

socketio.on("cancelRecResult", function (data) {
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

function toggleAutoRec() {
    socketio.emit("getToggleAutoRec", programId, searchResultKeyId[programId].autorec);
}

socketio.on("autoRecResult", function (data){
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

