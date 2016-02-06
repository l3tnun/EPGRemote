function scrollTopButton() {
    $('html,body').animate({ scrollTop: 0 }, 'swing');
}

function getUrlQuery() {
    var url = window.location.search;
    var query = {};
    array  = url.slice(1).split('&');
    for (var i = 0; i < array.length; i++) {
        vars = array[i].split('=');
        query[vars[0]] = vars[1];
    }

    return query;
}

function setQuery() {
    var query = getUrlQuery();

    if(typeof query.station != "undefined") { $("#station").val(query.station); }
    if(typeof query.category_id != "undefined") { $("#genre").val(query.category_id); changeSubGenre(); }
    if(typeof query.sub_genre != "undefined") { $("#sub_genre").val(query.sub_genre); }
    if(typeof query.search != "undefined") {
        $("#search").val(decodeURIComponent(query.search));
        getEPGRecSearchResult();
    }
}

/*検索オプションの設定を取得*/
var genrus = {}, subGenrus, stations = {}, recModeDefaultId;
var socketid = `${new Date().getTime()}:${Math.random().toString(36).slice(-8)}`;
$(function () {
    socketio.emit("getEPGRecSearchSetting", socketid);

    socketio.on("resultEPGRecSearchSetting", function(data) {
        if(socketid != data.socketid) { return; }

        data.genrus.forEach(function(genru) {
            genrus[genru.id] = genru.name_jp
            $("#genre").append($('<option>').html(`${genru.name_jp}`).val(`${genru.id}`));
            $("#rec_genre").append($('<option>').html(`${genru.name_jp}`).val(`${genru.id}`));
        });

        data.channel.forEach(function(channel) {
            stations[channel.channel_disc] = channel.sid;
            $("#station").append($('<option>').html(`${channel.name}`).val(`${channel.id}`));
        });

        var startTranscodeId = data.startTranscodeId;
        var i = 0;
        data.recMode.forEach(function(mode) {
            $("#rec_mode").append($('<option>').html(`${mode.name}`).val(`${mode.id}`));
            $("#k_autorec_mode").append($('<option>').html(`${mode.name}`).val(`${mode.id}`));

            if(i == 0) {
                $("#trans_mode0").append($('<option>').html("未指定").val("0"));
                $("#trans_mode1").append($('<option>').html("未指定").val("0"));
                $("#trans_mode2").append($('<option>').html("未指定").val("0"));
            }

            if(i >= startTranscodeId) {
                $("#trans_mode0").append($('<option>').html(`${mode.name}`).val(`${mode.id}`));
                $("#trans_mode1").append($('<option>').html(`${mode.name}`).val(`${mode.id}`));
                $("#trans_mode2").append($('<option>').html(`${mode.name}`).val(`${mode.id}`));
            }
            i += 1;
        });

        recModeDefaultId = data.recModeDefaultId;
        subGenrus = data.subGenrus;

        setQuery();
    });
});

function changeSubGenre() {
    $('#sub_genre').empty();
    $('#sub_genre').append($('<option>').html("すべて").val("16"));
    var i = 0;
    subGenrus[$('#genre option:selected').val() - 1].forEach(function(sub) {
        $('#sub_genre').append($('<option>').html(sub).val(i));
        i += 1;
    });
    $('#sub_genre').append($('<option>').html("その他").val(15));
}

$(function($) {
    //ジャンルが変更された時にサブジャンルを書き換える
    $('#genre').change(function() {
        changeSubGenre();
    });

    //Enter キーが押された時
    $('#search').keypress(function(key) {
        if(key.which == 13) {
            getEPGRecSearchResult();
            $('#search').blur();
            return false;
        }
    });
});

/*番組情報ダイアログ*/
var programId;
function openInfoDialog(id) {
    $("#programDialogTitle").text(searchResultKeyId[id].title);
    $("#programDialogChannelName").text(searchResultKeyId[id].station_name_str);
    $("#programDialogTime").text(`${searchResultKeyId[id].date} ${searchResultKeyId[id].starttime}${searchResultKeyId[id].endtime}(${searchResultKeyId[id].duration})`);
    $("#programDialogDescription").text(searchResultKeyId[id].description);

    if(searchResultKeyId[id].rec == 0) {
        $("#reced_buton").hide();
        $("#no_reced_button").show();
    } else {
        $("#reced_buton").show();
        $("#no_reced_button").hide();
    }

    if(searchResultKeyId[id].autorec == 1) {
        $("#no_reced_autorec").text("自動禁止");
        $("#reced_autorec").text("自動禁止");
    } else {
        $("#no_reced_autorec").text("自動許可");
        $("#reced_autorec").text("自動許可");
    }

    programId = id;
    $("#infoDialog").popup('open');
}


/*詳細ダイアログ*/
function getTimeValue(topStr, time) {
    var array = time.split(":");
    var year = Number(topStr.substr(0, 4));
    var month = Number(topStr.substr(4, 2));
    var day = Number(topStr.substr(6, 2));
    return { year: year, month: month, day: day, hour: Number(array[0]), minute: Number(array[1]), second: Number(array[2]) }
}

function setDetailDialog() {
    station = searchResultKeyId[programId];
    var startTime = getTimeValue(station.prg_top, station.starttime.slice(0, -1));
    var endTime = getTimeValue(station.prg_top, station.endtime);

    $("#detail_rec_start_year").val(startTime.year);
    $("#detail_rec_start_month").val(startTime.month);
    $("#detail_rec_start_day").val(startTime.day);
    $("#detail_rec_start_hour").val(startTime.hour);
    $("#detail_rec_start_minute").val(startTime.minute);
    $("#detail_rec_start_second").val(startTime.second);

    $("#detail_rec_end_year").val(endTime.year);
    $("#detail_rec_end_month").val(endTime.month);
    $("#detail_rec_end_day").val(endTime.day);
    $("#detail_rec_end_hour").val(endTime.hour);
    $("#detail_rec_end_minute").val(endTime.minute);
    $("#detail_rec_end_second").val(endTime.second);

    $("#detail_program_id_checkbox").prop("checked", true);
    $("#detail_rec_delete_file").prop("checked", false);
    $("#detail_rec_discontinuity").prop("checked", false);

    $("#rec_genre").val(station.genre_id);
    $("#rec_genre").selectmenu('refresh',true);

    $("#rec_mode").val(recModeDefaultId);
    $("#rec_mode").selectmenu('refresh',true);

    $('#detail_rec_station_name').text(station.type + ":" + station.station_name_str)
    $('#detail_rec_title').val(station.title);
    $('#detail_rec_description').val(station.description);
    $('#detail_channel_id').text(station.channel_id);
}

var detailDialogLeftPosition = -1;
var detailDialogHeight = -1;
function openDetailRecDialog() {
    setDetailDialog();
    $("#infoDialog").popup('close');
    if(detailDialogHeight != -1) {
        $("#detailRecDialog-popup").height(detailDialogHeight);
    }
    $("#detailRecDialog").popup('open');
    if($(window).width() < 450) {
        $("#detailRecDialog").css("transform", "scale(" + $(window).width() / 450 + ")");
        if(detailDialogLeftPosition == -1) {
            detailDialogLeftPosition = $("#detailRecDialog").offset().left - 8;
            detailDialogHeight = $("#detailRecDialog-popup").height();
        }
        $("#detailRecDialog").css("left", "-" + detailDialogLeftPosition + "px");
        $("#detailRecDialog-popup").height(0);
    } else {
        $("#detailRecDialog").css("transform", "scale(1.0)");
    }
}

