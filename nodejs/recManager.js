var spawn = require('child_process').spawn;
var util = require(__dirname + "/util");
var log = require(__dirname + "/logger").getLogger();
var tunerManager = require(__dirname + "/tunerManager");

function runRec(channel, sid, tunerId) {
    var tunerConfig = tunerManager.getTunerComand(tunerId, sid, channel).split(" ");
    var tunerCmd = tunerConfig.shift();

    var recChild = spawn(tunerCmd, tunerConfig);
    log.stream.info(`run rec command pid : ${recChild.pid}`);

    recChild.stderr.on('data', function (data) { log.stream.debug(`rec: ${data}`); });

    return recChild;
}

exports.runRec = runRec

