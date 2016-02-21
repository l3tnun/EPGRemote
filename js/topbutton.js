jQuery(function($) {
    var ua = navigator.userAgent.toLowerCase();
    if(ua.indexOf('ipod') != -1 || ua.indexOf('iphone') != -1) {
        $("#scroll_top_button").addClass("ios_top_button_postion");
    }
});

