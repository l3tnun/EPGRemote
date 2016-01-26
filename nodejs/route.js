var path = require('path');
var requestHandlers = require(__dirname + "/requestHandlers");
var log = require(__dirname + "/logger").getLogger();

var handle = {}
handle["/"] = requestHandlers.topPage;
handle["/index.html"] = requestHandlers.topPage;
handle["/settings"] = requestHandlers.settings;
handle["/tvprogram"] = requestHandlers.tvProgram;
handle["/viewtv"] = requestHandlers.viewTv;
handle["/viewtv_error"] = requestHandlers.viewTvError;
handle["/epgrec"] = requestHandlers.epgrec;
handle["/epgrec_program"] = requestHandlers.epgrecProgram;
handle["/epgrec_recorded"] = requestHandlers.epgrecRecorded;

var fileTypeHash = {
    ".css"  : "text/css",
    ".js"   : "text/javascript",
    ".ts"   : "application/vnd.apple.mpegurl",
    ".m3u8" : "video/MP2T",
    ".gif"  : "image/gif",
    ".mp4"  : "video/mp4"
}

function route(parsedUrl, response, postData) {
    log.access.info("About to route a request for " + parsedUrl.pathname);
    if(typeof handle[parsedUrl.pathname] == 'function') {
        return handle[parsedUrl.pathname](response, parsedUrl, postData);
    } else if (path.extname(parsedUrl.pathname) in fileTypeHash) {
        return requestHandlers.responseSpecifiedFile(response, parsedUrl, fileTypeHash);
    } else {
        return requestHandlers.notFound(response);
    }
}

exports.route = route;

