$(function() {
    $('.logCheckbox').on('change', function () {
        var info = $("#info").prop('checked');
        var warning = $("#warning").prop('checked');
        var error = $("#error").prop('checked');
        var debug = $("#debug").prop('checked');

        socketio.emit("getEPGRecLog", socketid, info, warning, error, debug);
    });

    socketio.on("resultEPGRecLog", function (data) {
        if(data.socketid != socketid) { return; }

        if(data.results == "") { $("#content").empty(); return; }
        var listStr = "";
        data.results.forEach(function(result) {
            listStr += `<li><p>${result.logtime}</p>`;
            listStr += `<p>${result.message.replace("programTable.php","epgrec_search")}</p></li>`;
        });

        console.log(data.results);
        $("#content").empty();
        $(listStr).appendTo($("#content"));
        $("#content").listview('refresh');
    });
});



