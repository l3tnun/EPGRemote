function rec(id) {
    socketio.emit("getRec", id);
    socketio.on("recResult", function (data){
        var recv = data.value.match(/error/i);
        if( recv != null ){
            alert(data.value);
            $('#progDialog').popup('close');
        } else {
            var pt = data.value.split( ':' );
            var r_id = parseInt(pt[0]);
            var tuner = pt[1];
            var reload = parseInt(pt[3]);

            if( reload ){
                location.reload();
            } else {
                if( r_id ) {
                    $('#prgID_' + r_id).addClass('tv_program_reced'); //赤枠追加
                }
                $('#progDialog').popup('close');
            }
        }
    });
};

function cancelRec(id) {
    socketio.emit("getCancelRec", id);
    socketio.on("cancelRecResult", function (data){
        var recv = data.value.match(/^error/i);
        if( recv != null ){
            alert(data.value);
            $('#progDialog').popup('close');
        } else {
            var reload = parseInt(data.value);
            if( reload ){
                location.reload();
            } else {
                $('#prgID_' + id).removeClass('tv_program_reced');
            }
            $('#progDialog').popup('close');
        }
    });
}

function toggleAutoRec(id) {
    var autorec;
    if($("#prgID_" + id)[0].className.split(" ").indexOf("tv_program_freeze") >= 0) {
        autorec = 0;
    } else {
        autorec = 1;
    }

    socketio.emit("getToggleAutoRec", id, autorec);
    socketio.on("autoRecResult", function (data){
        if(id != data.id) { return; }
        if(!data.value) {
            $('#prgID_' + id).addClass('tv_program_freeze');
        } else {
            $('#prgID_' + id).removeClass('tv_program_freeze');
        }
        $('#progDialog').popup('close');
    });
}

function programSearch(id) {
    var info = $("#prgID_" + id).contents('div');
    var keyword;
    for(var i = 0; i < info.length; i++) {
        if(info[i].className == "pr_keyword") {
            keyword = info[i].innerHTML;
        }
    }

    socketio.emit("getEpgRecHostName");
    socketio.on("epgRecHostNameResult", function (data){
        urlStr = ""
        if(data.value.slice(-1) != "/") {
            urlStr = data.value + "/" + keyword;
        } else {
            urlStr = data.value + keyword;
        }
        location.href = "http://" + urlStr;
    });
    $('#progDialog').popup('close');
}

