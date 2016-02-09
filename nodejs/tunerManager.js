var util = require(__dirname + "/util")
var log = require(__dirname + "/logger").getLogger();
var tunerStatusHash = {};

function lockTuner(id, streamNumber) {
    if(id in tunerStatusHash) {
        log.stream.warn(`tuner No.${id} is locked by stream No.${tunerStatusHash[id]}`);
        return false;
    } else {
        tunerStatusHash[id] = streamNumber;
        log.stream.info(`tuner No${id} lock`);
        return true;
    }
}

function unlockTuner(streamNumber) {
    for (var key in tunerStatusHash){
        if(tunerStatusHash[key] == streamNumber) {
            delete tunerStatusHash[key];
            log.stream.info(`unlocked tuner No.${key}`);
            return;
        }
    }

    log.stream.error(`failed unlocked tuner No.${key}`);
}

function getActiveTuner(type, id) {
    var result = [];
    json = util.getConfig()["tuners"];
    for(var i = 0; i < json.length; i++) {
        if((json[i]["types"].indexOf(type) >= 0 && typeof id != "undefined" && json[i]["id"] == id) ||json[i]["types"].indexOf(type) >= 0 && !(json[i]["id"] in tunerStatusHash)) {
            result.push(json[i]);
            log.stream.info("set active tuner ");
        }
    }

    log.stream.info("return active tuner");
    return result;
}

function getLockedTunerId(streamNumber) {
    for (var key in tunerStatusHash) {
        if(tunerStatusHash[key] == streamNumber) {
            log.stream.info("No. " + streamNumber + " is Locked Tuner.");
            return key;
        }
    }

    log.stream.info("No ." + streamNumber + " is not Locked Tuner.");
    return;
}

function getTunerComand(id, sid, channel) {
    json = util.getConfig()["tuners"];
    for(var i = 0; i < json.length; i++) {
        if(json[i]["id"] == id) {
            var cmd = json[i]["command"].replace("<sid>", sid).replace("<channel>", channel);
            log.stream.info("return tuner command " + cmd);
            return cmd;
        }
    }

    return;
}

function getVideoSize() {
    var result = [];
    json = util.getConfig()["video"];
    for(var i = 0; i < json.length; i++) {
        result.push(json[i]);
    }

    return result;
}


function getVideoConfig(id) {
    var result = [];
    json = util.getConfig()["video"];
    for(var i = 0; i < json.length; i++) {
        if(json[i]["id"] == id) {
            return json[i];
        }
    }

    return;
}

exports.lockTuner = lockTuner;
exports.unlockTuner = unlockTuner;
exports.getActiveTuner = getActiveTuner;
exports.getLockedTunerId = getLockedTunerId;
exports.getTunerComand = getTunerComand;
exports.getVideoSize = getVideoSize;
exports.getVideoConfig = getVideoConfig;

