var log = require(__dirname + "/../../logger").getLogger();
var sqlModel = require(__dirname + "/../../sqlModel");

module.exports = function(io, socket) {
    //ログ取得
    socket.on("getEPGRecLog", function (socketid, info, warning, error, debug) {
        log.access.info(`socketio 'getEPGRecLog.' was called.`);
        sqlModel.getEPGRecLog([info, warning, error, debug], function(results) {
            if(results != "") {
                results.forEach(function(result) {
                    result.level = getLevel(result.level);
                    result.logtime = getDateStr(result.logtime);
                    result.message = replaceMessage(result.message);
                });
            }
            io.sockets.emit("resultEPGRecLog", { socketid: socketid, results: results });
        });
    });
}

var levelStrHash = { 0: "情報", 1: "警告", 2: "エラー", 3: "デバック" };
function getLevel(level) {
    var str = levelStrHash[level];

    return { str: str, level: level }
}

function getDateStr(str) {
    var d = new Date(str);
    return `${d.getFullYear()}-${addZero(d.getMonth() + 1)}-${addZero(d.getDate())} ${addZero(d.getHours())}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())}`;
}

function addZero(str) { return ('0' + str).slice(-2); }

function replaceMessage(message) {
    if(message.indexOf("programTable.php") != -1) {
        message = message.replace("programTable.php","epgrec_search");
        message = message.replace(" href"," target='_self' href");
    }

    message = message.replace("index.php","epgrec_program");

    if(message.indexOf("recordedTable.php") != -1) {
        return message.replace("recordedTable.php","epgrec_recorded").replace("key", "keyword");
    }

    return message;
}

