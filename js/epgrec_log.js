$(function() {
    checkCheckbox();
    $('.logCheckbox').on('change', function () { checkCheckbox(); });

    socketio.on("resultEPGRecLog", function (data) {
        if(data.socketid != socketid) { return; }

        if(data.results == "") { $("#content").empty(); return; }
        var listStr = "";
        data.results.forEach(function(result) {
            listStr += `<li class="logBackground${result.level.level}"><p>${result.logtime} ${result.level.str}</p>`;
            listStr += `<p class="wordbreak">${result.message}</p></li>`;
        });

        $("#content").empty();
        $(listStr).appendTo($("#content"));
        $("#content").listview('refresh');
    });

    function checkCheckbox() {
        var info = $("#info").prop('checked');
        var warning = $("#warning").prop('checked');
        var error = $("#error").prop('checked');
        var debug = $("#debug").prop('checked');

        socketio.emit("getEPGRecLog", socketid, info, warning, error, debug);
    }
});

