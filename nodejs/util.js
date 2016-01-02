var fs = require('fs');
var path = require('path');

var config;
var configPath;
var rootPath;

function updateConfig() {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
}

function setPath(dirPath) {
    rootPath = dirPath;
    configPath = path.join(dirPath, "/config.json");
    updateConfig();
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

