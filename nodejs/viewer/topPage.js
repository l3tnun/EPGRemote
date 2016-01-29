var readFile = require(__dirname + "/readFile");
var notFound = require(__dirname + "/notFound");
var responseFile = require(__dirname + "/responseFile");

module.exports = function(response, streamStatus) {
    var htmlfile = readFile("/HTML/index.html");
    if(typeof htmlfile == "undefined") { notFound(response, 'file not found'); return; }
    var channelStr = " ";
    if(Object.keys(streamStatus).length > 0) {
        channelStr += '<li data-role="list-divider"><center>現在放送中</center></li>'
         for (var key in streamStatus){
            channelStr += `<li><a href="viewtv?num=${key}" TARGET="_self">${streamStatus[key].channelName}</a></li>`
        }
    }
    responseFile(response, htmlfile.replace("@@@CHANNEL@@@", channelStr));
}
