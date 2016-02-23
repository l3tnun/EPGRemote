$(function() {
    var windowHeightForPopup = windowHeightForPopup = $(window).height();
    var orgWindowHeightForPopup = orgWindowHeightForPopup = $(window).height();

    $(window).resize(function () {
        if($(window).height() > orgWindowHeightForPopup) {
            orgWindowHeightForPopup = $(window).height();
        }

        if(windowHeightForPopup > $(window).height()) {
            var tag = $(':focus').prop("tagName");
            var windowKeyboardHeightForPopup = 0
            if(tag == "INPUT") {
                windowKeyboardHeightForPopup = $(window).height() / 2 - orgWindowHeightForPopup / 10;
            } else if(tag == "TEXTAREA") {
                windowKeyboardHeightForPopup = $(window).height() / 2 - orgWindowHeightForPopup / 2;
            }
            $(".ui-popup-active").css("top", windowKeyboardHeightForPopup + "px");
        } else if($(".ui-popup-active").height() != null) {
            $(".ui-popup-active").css("top", (($(window).height() - $(".ui-popup-active").height()) / 2) + "px");
        }
    });
});

