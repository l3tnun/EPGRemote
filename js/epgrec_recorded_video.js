var socketid = `${new Date().getTime()}:${Math.random().toString(36).slice(-8)}`;

function getVideoList(id) {
    socketio.emit("requestVideoLink", socketid, id);
}

socketio.on("resultDeleteVideoLink", function(id, videoPaths) {
    if(socketid != id) { return; }

    if(videoPaths.length == 0) {
        openVideoNotFoundDialog('動画ファイルがありません');
    } else {
        openMultipleVideo(videoPaths);
    }
});

function openMultipleVideo(videoPaths) {
    $("#videoLinkContent").empty();
    videoPaths.forEach(function(videoPath) {
        var linkStr;
        if(videoPath.video_status == 2) {
            linkStr = `<a href="${videoPath.path}" target="_self" class="ui-btn">${videoPath.mode}</a>`;
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

