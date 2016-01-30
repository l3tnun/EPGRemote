var readFile = require(__dirname + "/readFile");
var notFound = require(__dirname + "/notFound");
var responseFile = require(__dirname + "/responseFile");

module.exports = function(response, streamNumber) {
    var htmlfile = readFile("./HTML/viewtv.html");
    if(typeof htmlfile == "undefined") { notFound(response, 'file not found'); return; }
    var videoTag = `streamfiles/stream${streamNumber}.m3u8`;

    htmlfile = htmlfile.replace("@@@TVWAATCH@@@", videoTag);
    htmlfile = htmlfile.replace("@@@STREAMNUMBER@@@", streamNumber);
    responseFile(response, htmlfile);
}

