/*HTML から呼ばれる部分*/
function deleteVideo(rec_id) {
    socketio.emit("requestDeleteVideoFile", rec_id, $('#delete_file')[0].checked);
}

function openVideoNotFoundDialog(errorStr) {
    $("#videoNotFoundDialogStr").text(errorStr);
    $("#videoNotFoundDialog").popup('open');
}

function openSearch() {
    $('#pullDownMenu').popup('close');
    $('#searchForm').css("display", "block");
}

function openDeleteDialog(id, title) {
    $("#deleteDialog").empty();
    $("#deleteDialog").append('<div style="font-weight: bold; ">' + title + " を削除しますか?" + '</div>');
    var checkbox = '<div style="text-align:center; margin: 10px;"><input id="delete_file" style="margin-right: 15px;" name="delete_file" value="1" type="checkbox" checked="checked">録画ファイルも削除する</div>'

    $("#deleteDialog").append(checkbox);
    var button = '<div class="ui-grid-a">';
    button += '<div class="ui-block-a"><a data-rel="back" href="#" class="ui-btn ui-corner-all">戻る</a></div>'
    button += '<div class="ui-block-b"><a id="deleteButton" href="javascript:deleteVideo(' + id  + ')' + '" class="ui-btn ui-btn-b ui-corner-all">削除</a></div></div>';
    $("#deleteDialog").append(button);
    $('#actionMenu').popup('close');
    $("#deleteDialog").popup('open');
}

function openProgramInfo(title, info, channleName, thumbs, description) {
    $("#programDialogTitle").text(title);
    $("#programDialogInfo").text(info);
    $("#programDialogChannelName").text(channleName);
    $("#programDialogThumbs").attr("src", thumbs);
    $("#programDialogDescription").text(description);

    $('#actionMenu').popup('close');
    $("#programInfoDialog").popup('open');
}

/*socketio 受信関係*/
(function () {
    //video削除処理
    socketio.on("resultDeleteVideoFile", function(result) {
        if(result.match(/^error/i)){
            $.growl.error({ message: result });
        } else {
            location.reload();
        }
    });
}());

//検索処理
$(function($) {
    //Enter キーが押された時
    $('#search').keypress(function(key) {
        if(key.which == 13 && $("#search").val() != '') {
            var parameters = getQueryParameter(getQuery());
            location.href = window.location.pathname + "?search=" + $("#search").val() + parameters
        }
    });
});

$(window).load(function() {
    //アクションメニュー
    $('.openActionMenu').on('click', function(element, ui) {
        var id = element.target.id;
        var title = $('#'+ id).attr('programTitle');
        var info = $('#'+ id).attr('programInfo');
        var channelName = $('#'+ id).attr('programChannelName');
        var thumbs = $('#'+ id).attr('programThumbs');
        var description = $('#'+ id).attr('programDescription');
        var programId = $('#'+ id).attr('programId')
        $("#actionProgram").attr('href', `javascript:openProgramInfo("${title}", "${info}", "${channelName}", "${thumbs}", "${description}")`);
        $("#actionDownload").attr('href', $('#'+ id).attr('downloadLink'));
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

    var query = getQuery();
    var parameters = getQueryParameter(query);
    var pathname = window.location.pathname;

    if(typeof query.num == "undefined" || query.num < 2) {
        $(".pagination_prev").css("visibility", "hidden");
        $(".pagination_name").text("ページ1");
        $(".pagination_next").attr("href", pathname + "?num=2" + parameters)
    } else {
        $(".pagination_name").text("ページ" + query.num);
        $(".pagination_next").attr("href", pathname + "?num=" + (Number(query.num) + 1) + parameters)
        $(".pagination_prev").attr("href", pathname + "?num=" + (Number(query.num) - 1) + parameters)
    }
});

function getQueryParameter(query) {
    var parameterList = ["keyword", "channel"];

    var parameters = ""
    parameterList.forEach(function(parameter) {
        if(typeof query[parameter] != "undefined") { parameters += "&" + parameter + "=" + query[parameter]; }
    });

    return parameters;
}
