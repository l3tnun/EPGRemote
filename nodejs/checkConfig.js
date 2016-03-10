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
    field = { GR: "boolean", BS: "boolean", CS: "boolean", EX: "boolean" }
    checkHash(json, "broadcast", field, true);

    //video
    var field = { id: "string", size: "string", vb: "string", ab: "string", audioMode: "string" }
    checkHashsInArray(json, "video", field, json.useHLS);

    //tuners
    field = { id: "string", name: "string", types: "Array", command: "string" }
    checkHashsInArray(json, "tuners", field, json.useHLS);

    //ffmpeg
    field = { command: "string" }
    checkHash(json, "ffmpeg", field, json.useHLS);

    //EpgrecDatabaseCpnfig
    field = { host: "string", user: "string", password: "string", database: "string", timeout: "number" }
    checkHash(json, "EpgrecDatabaseCpnfig", field, true);

    //epgrecConfig
    if(typeof json.epgrecConfig == "undefined") {
        log.system.fatal("config.json: epgrecConfig is not found.");
        process.exit();
    }

    //epgrecConfig.recMode
    field = {id: "string", name: "string"}
    checkHashsInArray(json.epgrecConfig, "recMode", field, true);

    field = { host: "string", "programTable.php" : "string", "keywordTable.php" : "string", videoPath: "string", thumbsPath: "string", startTranscodeId: "string", recModeDefaultId: "string" }
    checkHash(json, "epgrecConfig", field, true);
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

function checkHashsInArray(json, name, field, required) {
    var array = json[name];

    if(typeof array == "undefined" || array instanceof Array == false || array.length == 0) {
        if(required) {
            log.system.fatal(`config.json: ${name} is type error.`);
            process.exit();
        } else {
            return;
        }
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

function checkHash(json, name, field, required) {
    var hash = json[name];
    if(typeof hash == "undefined") {
        if(required) {
            log.system.fatal(`config.json: ${name} is not found.`);
            process.exit();
        } else {
            return;
        }
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

