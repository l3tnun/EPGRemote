jQuery(function($) {
    $("#arrow-container").css("top", ($(window).height() / 2) + "px");

    var touchStart = false;
    var moveX = startX = endX = startY = endY = 0;
    $('body').bind('touchmove', function(){
        if (!touchStart) { event.preventDefault(); return; }
        endX = event.touches[0].pageX;
        endY = event.touches[0].pageY;
        setArrow();
    }).bind('touchstart', function(){
        touchStart = true;
        startX = event.touches[0].pageX;
        startY = event.touches[0].pageY;
    }).bind('touchend', function(){
        if (!touchStart){ return; }

        var move = $("#arrow-slider")[0].style.transform.replace("px", "").match(/\((.+)\)/)[1].split(",")[0]
        if(move > 0 && move > 55) {
            console.log("back");
        } else if(move < 0 && move < -55) {
            console.log("next");
        }
        resetArrow();
    });

    function setArrow() {
        var moveY = Math.abs(endY - startY);
        moveX = (endX - startX);
        if(Math.abs(moveX) > 1 && moveY < 10) {
            if(0 > moveX && -60 > moveX) { moveX = -60; }
            if(0 < moveX &&  60 < moveX) { moveX = 60; }
            $("#arrow-container").addClass("swiping");
            $("#arrow-slider").css("transform", "translate3d(" + moveX  + "px, 0px, 0px)");
        }
    }

    function resetArrow() {
        touchStart = false;
        $("#arrow-slider").css("transform", "translate3d(0px, 0px, 0px)");
        $("#arrow-container").removeClass("swiping");
    }
});
