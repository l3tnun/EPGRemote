socketio.on('connect',function() {
    socketio.headbeatTimeout = 1000;
});

socketio.on('reconnecting',function(){
    socketio.connect();
});

