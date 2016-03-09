var viewerEpgrecProgram = require(__dirname + "/../viewer/epgrecProgram");
var log = require(__dirname + "/../logger").getLogger();
var util = require(__dirname + '/../util');

module.exports = function(response, parsedUrl) {
    log.access.info("Request handler 'epgrecProgram' was called.");
    var type = parsedUrl.query.type;
    var length = parsedUrl.query.length;
    var time = parsedUrl.query.time;
    var ch = parsedUrl.query.ch;

    if(typeof type == "undefined") { type = "GR"; }
    if(typeof length == "undefined") { length = util.getConfig()["tvTimeHourLength"]; }
    if(typeof time == "undefined" || !(time.length >= 9  && time.length <= 10)) {
        var date = new Date();
        time = `${date.getFullYear()}${('0'+(date.getMonth()+1)).slice(-2)}${('0' + date.getDate()).slice(-2)}${('0' + date.getHours()).slice(-2)}`;
    }
    if(typeof ch != "undefined") { length = 24; }
    viewerEpgrecProgram(response, length, time, type, ch);
}

