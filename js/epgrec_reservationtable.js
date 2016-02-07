function scrollTopButton() {
    $('html,body').animate({ scrollTop: 0 }, 'swing');
}

//予約削除処理
socketio.on("resultCancelReservation", function(result) {
    if(result.match(/^error/i)){
        $.growl.error({ message: result });
    } else {
        location.reload();
    }
});

function deleteVideo(rec_id) {
    socketio.emit("requestCancelReservation", rec_id, $('#check_autorec')[0].checked);
}

function openDeleteDialog(id, title) {
    $("#deleteDialog").empty();
    $("#deleteDialog").append('<div style="font-weight: bold; ">' + title + " を削除しますか?" + '</div>');
    var checkbox = '<div style="text-align:center; margin: 10px;"><input id="check_autorec" style="margin-right: 15px;" name="autorec_check" value="1" type="checkbox">自動予約禁止</div>'

    $("#deleteDialog").append(checkbox);
    var button = '<div class="ui-grid-a">';
    button += '<div class="ui-block-a"><a data-rel="back" href="#" class="ui-btn ui-corner-all">戻る</a></div>'
    button += '<div class="ui-block-b"><a id="deleteButton" href="javascript:deleteVideo(' + id  + ')' + '" class="ui-btn ui-btn-b ui-corner-all">削除</a></div></div>';
    $("#deleteDialog").append(button);
    $('#actionMenu').popup('close');
    $("#deleteDialog").popup('open');
}

//プログラム詳細
function openProgramInfo(title, channelName, time, description) {
    $("#programDialogTitle").text(title);
    $("#programDialogChannelName").text(channelName);
    $("#programDialogTime").text(time);
    $("#programDialogDescription").text(description);

    $('#actionMenu').popup('close');
    $("#programInfoDialog").popup('open');
}

$(window).load(function() {
    //アクションメニュー
    $('.openActionMenu').on('click', function(element, ui) {
        var id = element.target.id;
        var title = $('#'+ id).attr('programTitle');
        var info = $('#'+ id).attr('programInfo');
        var description = $('#'+ id).attr('programDescription');
        var programId = $('#'+ id).attr('programId');
        var keyword = $('#'+ id).attr('programKeyword');

        if(keyword == "undefined") {
            $("#actionEdit").css("display", "none");
        } else {
            $("#actionEdit").css("display", "block");
            $("#actionEdit").attr("href", keyword);
        }
        $("#actionDelete").attr('href','javascript:openDeleteDialog(' + programId + ',"' + title + '")');
        $('#actionMenu').popup('open', { x: element.pageX, y: element.pageY });
    });

    //pagination処理
    if($('#program_list').children().length == 0) {
        $(".pagination").css("display", "none");
        return;
    } else if($('#program_list').children().length < 15 || $("#page_next").val() == "true") {
        $(".pagination_next").css("visibility", "hidden");
    }

    var url = window.location.search;
    query = {};
    array  = url.slice(1).split('&');
    for (var i = 0; i < array.length; i++) {
        vars = array[i].split('=');
        query[vars[0]] = vars[1];
    }

    var pathname = window.location.pathname;

    if(typeof query.num == "undefined" || query.num < 2) {
        $(".pagination_prev").css("visibility", "hidden");
        $(".pagination_name").text("ページ1");
        $(".pagination_next").attr("href", pathname + "?num=2")
    } else {
        $(".pagination_name").text("ページ" + query.num);
        $(".pagination_next").attr("href", pathname + "?num=" + (Number(query.num) + 1))
        $(".pagination_prev").attr("href", pathname + "?num=" + (Number(query.num) - 1))
    }
});

