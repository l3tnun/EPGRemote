var log = require(__dirname + "/logger").getLogger();

function check(json) {
    simpleCheck(json, "serverPort", ["string", "number"], true);
    simpleCheck(json, "useHLS", "boolean", true);
    simpleCheck(json, "ffpresetPath", "string", json.useHLS);
    simpleCheck(json, "streamFilePath", "string", json.useHLS);
    simpleCheck(json, "EpgrecRecordName", "string", true);
    simpleCheck(json, "tvTimeLength", "number", true);
    simpleCheck(json, "tvTimeHourLength", "number", true);
    simpleCheck(json, "tvStationNameWidth", "number", true);
    simpleCheck(json, "RecordedStreamingiOSURL", "string", false);
    simpleCheck(json, "RecordedDownloadiOSURL", "string", false);

    //broadcast
    var broadcast = json.broadcast;
    for(key in broadcast) {
        if(typeof broadcast[key] == "undefined" || typeof broadcast[key] != "boolean") {
            log.system.fatal("config.json: broadcast is type error.");
            process.exit();
        }
    }
    log.system.info("config.json: ok broadcast");

    //video
    var field = { id: "string", size: "string", vb: "string", ab: "string", audioMode: "string" }
    checkHashsInArray(json, "video", field);

    //tuners
    field = { id: "string", name: "string", types: "Array", command: "string" }
    checkHashsInArray(json, "tuners", field);

    //ffmpeg
    field = { command: "string" }
    checkHash(json, "ffmpeg", field);

    //EpgrecDatabaseCpnfig
    field = { host: "string", user: "string", password: "string", database: "string", timeout: "number" }
    checkHash(json, "EpgrecDatabaseCpnfig", field);
}

function simpleCheck(json, name, types, required) {
    if(typeof types == "string") { types = [types]; }

    for(var i = 0; i < types.length; i++) {
        var typeStr = typeof json[name];
        if(typeStr == "undefined") {
            //必須項目かチェック
            if(required) {
                log.system.fatal(`config.json: ${name} is not found.`);
                process.exit();
            }
            return;
        }

        if(typeStr == types[i]) {
            log.system.info(`config.json: ok ${name}`);
            return;
        }
    }
    log.system.fatal(`config.json: ${name} is type error.`);
    process.exit();
}

function checkHashsInArray(json, name, field) {
    var array = json[name];

    if(array instanceof Array == false) {
        log.system.fatal(`config.json: ${name} is type error.`);
        process.exit();
    }

    for(var i = 0; i < array.length; i++) {
        for(key in field) {
            var typeStr = typeof array[i][key];
            if(typeStr == "undefined") {
                log.system.fatal(`config.json: ${name} is undefined error [array number of ${i} : ${key}] `);
                process.exit();
            } else if(field[key] != "Array" && typeStr != field[key]) {
                log.system.fatal(`config.json: ${name} is type error [array number of ${i} : ${key}] `);
                process.exit();
            } else if(field[key] == "Array" && array[i][key] instanceof Array == false){
                log.system.fatal(`config.json: ${name} is not array error [array number of ${i} : ${key}] `);
                process.exit();
            }
        }
    }

    log.system.info(`config.json: ok ${name}`);
}

function checkHash(json, name, field) {
    var hash = json[name];
    if(typeof hash == "undefined") {
        log.system.fatal(`config.json: ${name} is not found.`);
        process.exit();
    }

    for(key in field) {
        var typeStr = typeof hash[key];
        if(typeStr == "undefined" || typeStr != field[key]) {
            log.system.fatal(`config.json: ${name}.${key} is type error.`);
            process.exit();
        }
    }

    log.system.info(`config.json: ok ${name}`);
}

function checkTypeOfHash(hash) {
    for(key in hash) { return (typeof hash[key] != "undefined") }
}

exports.check = check;

