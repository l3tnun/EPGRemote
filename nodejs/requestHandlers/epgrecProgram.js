var viewer = require(__dirname + "/../viewer");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(response, parsedUrl) {
    log.access.info("Request handler 'epgrecProgram' was called.");
    var type = parsedUrl.query.type;
    var length = parsedUrl.query.length;
    var time = parsedUrl.query.time;

    if(typeof type == "undefined") { type = "GR"; }
    if(typeof length == "undefined") { length = 18; }
    if(typeof time == "undefined" || !(time.length >= 9  && time.length <= 10)) {
        var date = new Date();
        time = `${date.getFullYear()}${('0'+date.getMonth()+1).slice(-2)}${('0' + date.getDate()).slice(-2)}${('0' + date.getHours()).slice(-2)}`;
    }

    viewer.epgrecProgram(response, length, time, type);
}

