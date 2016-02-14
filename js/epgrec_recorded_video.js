var socketid = `${new Date().getTime()}:${Math.random().toString(36).slice(-8)}`;

function getVideoList(id) {
    socketio.emit("requestVideoLink", socketid, id);
}

socketio.on("resultDeleteVideoLink", function(id, videoPaths, iosStreamingURL, iosDownloadURL) {
    if(socketid != id) { return; }

    if(videoPaths.length == 0) {
        openVideoNotFoundDialog('動画ファイルがありません');
    } else {
        openMultipleVideo(videoPaths, iosStreamingURL, iosDownloadURL);
    }
});

function openMultipleVideo(videoPaths, iosStreamingURL, iosDownloadURL) {
    $("#videoLinkContent").empty();
    videoPaths.forEach(function(videoPath) {
        var linkStr;
        if(videoPath.video_status == 2) {
            var ua = navigator.userAgent.toLowerCase();
            if(ua.indexOf('ipad') != -1 || ua.indexOf('ipod') != -1 || ua.indexOf('iphone') != -1) {
                var host = window.location;
                var address = `${host.host}/video/videoid-${videoPath.id}-${videoPath.type}`;
                linkStr = `<a href="${iosStreamingURL.replace("ADDRESS", address)}" target="_self" class="ui-btn">${videoPath.mode}</a>`;
            } else {
                linkStr = `<a href="${videoPath.path}" target="_self" class="ui-btn">${videoPath.mode}</a>`;
            }
        } else {
            linkStr = `<a href="#" class="ui-btn">${videoPath.mode} : ${getVideoStatus(videoPath.video_status)}</a>`
        }
        $("#videoLinkContent").append(linkStr);
    });
    $("#multipleVideoDialog").popup('open');
}

function getVideoStatus(videoStatus) {
    switch (videoStatus) {
        case 0:
             return "変換待ち";
        case 1:
            return "変換中";
        case 3:
            return "変換失敗";
    }
    return "動画がありません";
}

