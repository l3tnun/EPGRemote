var fs = require('fs')
var path = require('path');
var util = require(__dirname + "/../util");
var log = require(__dirname + "/../logger").getLogger();

module.exports = function(filepath) {
    fullFilePath = path.join(util.getRootPath(), filepath);
    if(fs.existsSync(fullFilePath)) {
        return fs.readFileSync(fullFilePath, 'utf-8');
    } else {
        log.access.error("file not found");
        return;
    }
}

