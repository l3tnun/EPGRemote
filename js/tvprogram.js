/*swipe_page.js から呼ばれる*/
var tvProgramSwipeCount = 0;
var tvProgramUpdateTimer;
function swipeBackPage() {
    tvProgramSwipeCount = 0;
    clearInterval(tvProgramUpdateTimer);
    getTvProgramList();
}

function swipeNextPage() {
    tvProgramSwipeCount += 10;
    clearInterval(tvProgramUpdateTimer);
    getTvProgramList();
}

/*HTMLから呼ばれる*/
function postData(sid, channel, channelName) {
    document.getElementById("sid").innerHTML='<input type="hidden" name="sid" value='+ sid + ' id = "sid">'
    document.getElementById("channel").innerHTML='<input type="hidden" name="channel" value=' + channel + ' id = "channel">'
    document.getElementById("channelName").innerHTML='<input type="hidden" name="channelName" value=' + channelName + ' id = "channelName">'
    if(document.getElementById("tuner").options.length == 0) {
        window.alert('チューナーの空きがありません');
    } else {
        document.form.submit()
    }
}

function getType() {
    var query = getQuery();

    if(query.GR) { return "GR"}
    if(query.BS) { return "BS"}
    if(query.CS) { return "CS"}
    if(query.EX) { return "EX"}
}

function getTvProgramList() {
    socketio.emit("getTvProgramList", socketid, getType(), tvProgramSwipeCount); //番組リスト取得
}

function getJumpChannelConfig() {
    socketio.emit("getJumpChannelConfig", socketid, getType()); //チューナー、ビデオサイズ取得
}

//プルダウン
jQuery(function($) {
    var nav = $('#pulldown'),
    offset = nav.offset();

    $(window).scroll(function () {
        if($(window).scrollTop() > offset.top) {
            nav.addClass('fixed');
            document.getElementById('empty').innerHTML = '<div id="empty" style="padding-top:' + nav.height() + 'px;"/>';
        } else {
            nav.removeClass('fixed');
            document.getElementById('empty').innerHTML = '<div id="empty" style="padding-top:0px;"/>';
        }
    });

    if(typeof getType() == "undefined") { return; }
    getJumpChannelConfig();
    getTvProgramList();
});

//socketio 受信
$(function() {
    //チューナー、ビデオサイズ取得
    socketio.on("resultJumpChannelList", function (data) {
        if(data.socketid != socketid || typeof data.tunerList == "undefined" || typeof data.videoConfig == "undefined") { return; }

        $("#tuner").empty();
        data.tunerList.forEach(function(tuner) {
            $("#tuner").append($('<option>').html(tuner.name).val(tuner.id))
        });
        $('#tuner').selectmenu("refresh", true);

        $("#videoConfig").empty();
        data.videoConfig.forEach(function(video) {
            $("#videoConfig").append($('<option>').html(video.size).val(video.id))
        });
        $('#videoConfig').selectmenu("refresh", true);
    });

    //番組リスト取得
    socketio.on("resultTvProgramList", function (data) {
        if(data.id != socketid) { return; }

        //listの中身を削除
        $('#program_list').empty();

        var programStr = "";
        if(data.value.length == 0) {
            programStr += "<li>番組表情報が取得できませんでした。</li>"
        } else {
            var minTimer = 6048000000;
            var nowDate = new Date().getTime();
            for(var i = 0; i < data.value.length; i++) {
                var result = data.value[i];
                programStr += `<li><a href="javascript:postData('${result.sid}', '${result.channel}', '${result.name}')" TARGET="_self">`
                programStr += `<h3>${result.name}</h3>`
                programStr += `<p>${getFormatedDate(result.starttime)} ~ ${getFormatedDate(result.endtime)}</p>`
                programStr += `<p>${result.title}</p>`
                programStr += `<p class="wordbreak">${result.description}</p>`
                programStr += `</a></li>\n`;

                var subDate = new Date(result.endtime).getTime() - nowDate;
                if(minTimer > subDate) {
                    minTimer = subDate
                }
            }
            tvProgramUpdateTimer = setTimeout("getTvProgramList()", minTimer + 1000)
        }

        $(programStr).appendTo($("#program_list"));
        $('#program_list').listview('refresh');
    });

    function getFormatedDate(strDate) {
        var date = new Date(strDate);
        return ("0"+date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
    }

    socketio.on("changeStreamStatus", function (data) {
        getJumpChannelConfig();
    });
});

//上にスクロール
$(function() {
    $(".scroll_top_button").on('click',function() {
        $('html,body').animate({ scrollTop: 0 }, 'swing');
    });
});

