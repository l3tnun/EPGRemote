var fs = require('fs')
var path = require('path');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();
var notFound = require(__dirname + "/notFound");
var sqlModel = require(__dirname + "/../sqlModel");

module.exports = function(response, request, parsedUrl, fileTypeHash) {
    var uri = parsedUrl.pathname;
    var filename;
    if (uri.match(/streamfiles/)) {
        filename = path.join(util.getConfig()["streamFilePath"], path.basename(uri));
    } else if(uri.match(/thumbs/) && path.extname(parsedUrl.pathname) == ".jpg") {
        filename = decodeURIComponent(path.join(util.getConfig().epgrecConfig.thumbsPath, path.basename(uri)));
    } else if(uri.match(/videoid/) && path.extname(parsedUrl.pathname) == ".mp4") {
        var rec_id = path.basename(uri).replace("videoid", "").split(".")[0];
        sqlModel.getTranscodeList(rec_id, function(result) {
            if(result == '' || result.length == 0) { notFound(response); return; }

            filename = result[0].path.toString('UTF-8');
            responseFile(response, request, fileTypeHash, filename, uri);
        });
        return;
    } else if(path.extname(parsedUrl.pathname) == ".mp4") {
        filename = path.join(util.getConfig().epgrecConfig.videoPath, decodeURIComponent(uri));
    } else {
        filename = path.join(util.getRootPath(), uri);
    }

    responseFile(response, request, fileTypeHash, filename, uri);
}

function responseFile(response, request, fileTypeHash, filename, uri) {
    fs.exists(filename, function (exists) {
        if (!exists) {
            log.access.error(`${filename} is not found`);
            notFound(response);
            return;
        } else {
            var responseHeaders = {};
            responseHeaders['Content-Type'] = fileTypeHash[path.extname(uri)];

            var stat = fs.statSync(filename);
            var rangeRequest = readRangeHeader(request.headers['range'], stat.size);

            if (rangeRequest == null) {
                responseHeaders['Content-Length'] = stat.size;  // File size.
                responseHeaders['Accept-Ranges'] = 'bytes';

                sendResponse(response, 200, responseHeaders, fs.createReadStream(filename));
                return;
            }

            var start = rangeRequest.Start;
            var end = rangeRequest.End;

            if (start >= stat.size || end >= stat.size) {
                responseHeaders['Content-Range'] = 'bytes */' + stat.size; // File size.
                sendResponse(response, 416, responseHeaders, null);
                return;
            }

            responseHeaders['Content-Range'] = 'bytes ' + start + '-' + end + '/' + stat.size;
            responseHeaders['Content-Length'] = start == end ? 0 : (end - start + 1);
            responseHeaders['Accept-Ranges'] = 'bytes';
            responseHeaders['Cache-Control'] = 'no-cache';

            sendResponse(response, 206, responseHeaders, fs.createReadStream(filename, { start: start, end: end }));
        }
    });
}

function readRangeHeader(range, totalLength) {
    if (range == null || range.length == 0)
        return null;

    var array = range.split(/bytes=([0-9]*)-([0-9]*)/);
    var start = parseInt(array[1]);
    var end = parseInt(array[2]);
    var result = {
        Start: isNaN(start) ? 0 : start,
        End: isNaN(end) ? (totalLength - 1) : end
    };

    if (!isNaN(start) && isNaN(end)) {
        result.Start = start;
        result.End = totalLength - 1;
    }

    if (isNaN(start) && !isNaN(end)) {
        result.Start = totalLength - end;
        result.End = totalLength - 1;
    }

    return result;
}

function sendResponse(response, responseStatus, responseHeaders, readable) {
    response.writeHead(responseStatus, responseHeaders);

    if (readable == null) {
        response.end();
    } else {
        readable.on('open', function () {
            readable.pipe(response);
        });
    }
}

