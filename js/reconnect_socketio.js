$(function() {
    var connectStatus = true;
    var movePage = false;

    socketio.on('connect',function() {
        if(connectStatus == false) { location.reload(true); }
    });

    socketio.on('disconnect', function() {
        if(movePage == false) {
            $('#busy').css("visibility", "visible");
            $.growl.error({ message: "接続が切断されました。" });
        }
        connectStatus = false;
    });

    window.onunload = function() {};

    window.onpageshow = function(event) {
        if (event.persisted) {
            window.location.reload();
        }
    };

    window.onbeforeunload = function(event){
        event = event || window.event;
        connectStatus = true;
        movePage = true;
    }
})();

