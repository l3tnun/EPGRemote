var fs = require('fs');
var path = require('path');
var checkConfig = require(__dirname + "/checkConfig");
var log = require(__dirname + "/logger").getLogger();

var config;
var configPath;
var rootPath;

function updateConfig() {
    var configFile;
    try {
        configFile = fs.readFileSync(configPath, "utf8");
    } catch(e) {
        if (e.code === 'ENOENT') {
            log.system.fatal('config.json is not found.');
        } else {
            log.system.fatal(e);
        }
        process.exit();
    }

    try {
        config = JSON.parse(configFile);
    } catch(e) {
        log.system.fatal('config.json parse error.');
        log.system.fatal(e);
        process.exit();
    }
}

function setPath(dirPath) {
    rootPath = dirPath;
    configPath = path.join(dirPath, "/config.json");
    updateConfig();
    checkConfig.check(config);
    setInterval(function() {
        updateConfig();
    }, 30000);
}

function getConfig() {
    return config;
}

function getRootPath() {
    return rootPath;
}

exports.getConfig = getConfig;
exports.setPath = setPath;
exports.getRootPath = getRootPath;

