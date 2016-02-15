function getVideoList(id, mode) {
    socketio.emit("requestVideoLink", socketid, id, mode);
}

socketio.on("resultDeleteVideoLink", function(id, mode, videoPaths, iosStreamingURL, iosDownloadURL) {
    if(socketid != id) { return; }

    if(videoPaths.length == 0) {
        openVideoNotFoundDialog('動画ファイルがありません');
    } else {
        if(mode == "download") { $("#actionMenu").popup('close'); }
        openMultipleVideo(mode, videoPaths, iosStreamingURL, iosDownloadURL);
    }
});

function openMultipleVideo(mode, videoPaths, iosStreamingURL, iosDownloadURL) {
    $("#videoLinkContent").empty();
    videoPaths.forEach(function(videoPath) {
        var linkStr;
        if(videoPath.video_status == 2) {
            var ua = navigator.userAgent.toLowerCase();
            var address;
            if(ua.indexOf('ipad') != -1 || ua.indexOf('ipod') != -1 || ua.indexOf('iphone') != -1) {
                var host = window.location;
                if(mode == "stream") { address = iosStreamingURL.replace("ADDRESS", `${host.host}/video/videoid-${videoPath.id}-${videoPath.type}.ts`); }
                else { address = iosDownloadURL.replace("ADDRESS", `${host.host}/video/videoid-${videoPath.id}-${videoPath.type}.ts`).replace("FILENAME", videoPath.filename); }
            } else {
                address = videoPath.path
                if(mode == "download") { address = address + "?mode=download"; }
            }
            linkStr = `<a href="${address}" target="_self" class="ui-btn">${videoPath.mode}</a>`;
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

