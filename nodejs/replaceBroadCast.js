var util = require(__dirname + "/util");

module.exports = function(htmlfile) {
    var broadcast = util.getConfig()["broadcast"];
    for (var key in broadcast) {
        if(broadcast[key] == false) { replaceStr = "display: none;"; }
        else { replaceStr = ""; }
        htmlfile = htmlfile.replace("@@@" + key + "@@@", replaceStr);
    }

    return htmlfile;
}

