var connectStatus = true;
socketio.on('connect',function() {
    if(connectStatus == false) { location.reload(true); }
});

socketio.on('disconnect', function() {
    $('#busy').css("visibility", "visible");
    $.growl.error({ message: "接続が切断されました。" });
    connectStatus = false;
});

