var log = require(__dirname + "/../logger").getLogger();
var util = require(__dirname + "/../util");
var readFile = require(__dirname + "/readFile");
var notFound = require(__dirname + "/notFound");
var responseFile = require(__dirname + "/responseFile");

module.exports = function(response, streamNumber) {
    log.access.info("viewer 'viewTv' was called.");
    var htmlfile = readFile("./HTML/viewtv.html");
    if(typeof htmlfile == "undefined") { notFound(response, 'file not found'); return; }
    var videoTag = `streamfiles/stream${streamNumber}.m3u8`;

    var broadcast = util.getConfig()["broadcast"];
    for (var key in broadcast) {
        if(broadcast[key] == false) { replaceStr = "display: none;"; }
        else { replaceStr = ""; }
        htmlfile = htmlfile.replace("@@@" + key + "@@@", replaceStr)
    }

    htmlfile = htmlfile.replace("@@@TVWAATCH@@@", videoTag);
    htmlfile = htmlfile.replace("@@@STREAMNUMBER@@@", streamNumber);
    responseFile(response, htmlfile);
}

