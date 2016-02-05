function notifyGrowl(title, id) {
    if(typeof searchResultKeyId[id] == "undefined") { return; }
    var station = searchResultKeyId[id];
    $.growl({ title: title, message: station.station_name_str + " " + station.starttime + " " + station.endtime + "(" +  station.duration + ") " + station.title });
}

function closeDialogs(id) {
    if(id == programId) {
        $('#infoDialog').popup('close');
        //$('#progDetailRecDialog').popup('close');
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
                searchResultKeyId[r_id].rec = 1
                notifyGrowl("簡易予約", data.id)
            }
            closeDialogs(data.id);
        }
    }
});

function customRec() {

}

function cancelRec() {
    socketio.emit("getCancelRec", programId);
}

socketio.on("cancelRecResult", function (data){
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
            notifyGrowl("予約キャンセル", data.id)
            searchResultKeyId[data.id].rec = 1
            closeDialogs(data.id);
        }
    }
});

function toggleAutoRec() {

}
