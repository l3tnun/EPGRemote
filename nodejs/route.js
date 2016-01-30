var path = require('path');
var requestHandlers = require(__dirname + "/requestHandlers/");
var log = require(__dirname + "/logger").getLogger();

var handle = {}
handle["/"] = requestHandlers.topPage;
handle["/index.html"] = requestHandlers.topPage;
handle["/tvprogram"] = requestHandlers.tvProgram;
handle["/viewtv"] = requestHandlers.viewTv;
handle["/viewtv_error"] = requestHandlers.viewTvError;
handle["/epgrec"] = requestHandlers.epgrec;
handle["/epgrec_program"] = requestHandlers.epgrecProgram;
handle["/epgrec_recorded"] = requestHandlers.epgrecRecorded;
handle["/epgrec_recorded/tag"] = requestHandlers.epgrecRecordedTag;

var fileTypeHash = {
    ".css"  : "text/css",
    ".js"   : "text/javascript",
    ".ts"   : "application/vnd.apple.mpegurl",
    ".mp4"  : "video/mp4",
    ".m3u8" : "video/MP2T",
    ".jpg"  : "image/jpg",
    ".gif"  : "image/gif"
}

function route(parsedUrl, response, request, postData) {
    log.access.info("About to route a request for " + parsedUrl.pathname);
    if(typeof handle[parsedUrl.pathname] == 'function') {
        return handle[parsedUrl.pathname](response, parsedUrl, request, postData);
    } else if(parsedUrl.pathname.split(path.sep)[1] == "video") {
        return requestHandlers.responseVideoFile(response, request, parsedUrl, fileTypeHash);
    } else if (path.extname(parsedUrl.pathname) in fileTypeHash) {
        return requestHandlers.responseSpecifiedFile(response, request, parsedUrl, fileTypeHash);
    } else {
        return requestHandlers.notFound(response);
    }
}

exports.route = route;

