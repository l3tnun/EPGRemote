$(function () {
    updateStreamStatus();

    socketio.on('resultJumpChannelList',function(data) {
        if(data.socketid != socketid) { return; }

        $("#channelList").empty();
        if(data.channelStatus.length == 0) { return; }

        var channelStr = '<li data-role="list-divider"><center>現在放送中</center></li>'
        data.channelStatus.forEach(function(channel) {
            channelStr += `<li><a href="viewtv?num=${channel.num}" TARGET="_self">${channel.name}</a></li>`
        });

        $("#channelList").append(channelStr);
        $("#channelList").listview('refresh');
    });

    socketio.on("changeStreamStatus", function (data) {
        updateStreamStatus();
    });

    function updateStreamStatus() {
        socketio.emit("getStreamStatus", socketid);
    }
});

