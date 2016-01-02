var log4js = require('log4js');
var logger;

function init(path) {
    log4js.configure(path);

    logger = {
        system: log4js.getLogger('system'),
        access: log4js.getLogger('access'),
        stream: log4js.getLogger('stream')
    }
}

function getLogger() {
    return logger;
}

exports.init = init;
exports.getLogger = getLogger;

