module.exports = function(queryNum) {
    var num = 1;
    if(typeof queryNum != "undefined" && queryNum >= 2) {
        num = Number(queryNum);
    }

    return { "min" : (num - 1) * 15, "max" : num * 15 };
}

