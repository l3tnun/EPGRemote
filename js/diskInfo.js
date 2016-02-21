function openAboutDialog() {
    socketio.emit("getFreeDiskSpace", socketid);
}

socketio.on("resultFreeDiskSpace", function (data) {
    if(data.socketid != socketid) { return; }

    createCircliContent(data.total, data.part);
    $("#aboutDialog").popup('open');
});

function createCircliContent(total, part) {
    if($("#aboutDialog").length) { $("#aboutDialog").empty(); }
    var str = '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">close</a>';
    str += `<div id="diskInfoStat" data-text="${part}GB" data-total="${total}" data-part="${part}" data-info="ディスク空き容量" data-dimension="250" data-fontsize="38" data-fgcolor="#FFA07A"></div>`;
    $("#aboutDialog").append(str);
    $('#diskInfoStat').circliful();
}

