var fs = require('fs')
var path = require('path');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();
var notFound = require(__dirname + "/notFound");

module.exports = function(response, parsedUrl, fileTypeHash) {
    var uri = parsedUrl.pathname;
    var filename;

    if (uri.match(/streamfiles/)) {
        filename = path.join(util.getConfig()["streamFilePath"], path.basename(uri));
    } else {
        filename = path.join(util.getRootPath(), uri);
    }

    fs.exists(filename, function (exists) {
        if (!exists) {
            log.access.error(`${filename} is not found`);
            notFound(response);
            return;
        } else {
            fs.readFile(filename, function (err, contents) {
                if (err) {
                    log.access.error('failed send file: ' + filename);
                    internalServerError(response);
                } else if (contents) {
                    response.writeHead(200, {'Content-Type': fileTypeHash[path.extname(uri)]});
                    if(path.extname(uri) == ".ts") {
                        log.stream.info('sending file: ' + filename);
                        var stream = fs.createReadStream(filename, { bufferSize: 64 * 1024 });
                        stream.pipe(response);
                    } else {
                        log.access.info('sending file: ' + filename);
                        response.write(contents);
                        response.end();
                    }
                }
            });
        }
    });
}

function internalServerError(response) {
    response.writeHead(500);
    response.end();
}

