$(window).resize(function () {
    if($(window).height() > orgWindowHeightForPopup) {
        orgWindowHeightForPopup = $(window).height();
    }

    if(windowHeightForPopup > $(window).height()) {
        if(windowKeyboardHeightForPopup == 0 || windowKeyboardHeightForPopup > 0 && $(window).height() - windowKeyboardHeightForPopup > orgWindowHeightForPopup / 4) {
            windowKeyboardHeightForPopup = $(window).height() / 2 - orgWindowHeightForPopup / 10;
        }
        $(".ui-popup-active").css("top", windowKeyboardHeightForPopup + "px");
    } else if($(".ui-popup-active").height() != null) {
        $(".ui-popup-active").css("top", (($(window).height() - $(".ui-popup-active").height()) / 2) + "px");
    }
});

var windowHeightForPopup, orgWindowHeightForPopup, windowKeyboardHeightForPopup = 0;
$(function() {
    windowHeightForPopup = $(window).height();
    orgWindowHeightForPopup = $(window).height();
});

