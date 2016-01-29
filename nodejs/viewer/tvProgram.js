var tunerManager = require(__dirname + "/../tunerManager");
var readFile = require(__dirname + "/readFile");
var notFound = require(__dirname + "/notFound");
var responseFile = require(__dirname + "/responseFile");

module.exports = function(response, results, GR, BS, CS, EX) {
    var htmlfile = readFile("./HTML/tvprogram.html");
    if(typeof htmlfile == "undefined") { notFound(response, 'file not found'); return; }
    var date = new Date();

    var tunerNames = [];
    var tunerResults;

    if(GR) {
        tunerResults = tunerManager.getActiveTuner("GR");
    } else if(BS || CS) {
        tunerResults = tunerManager.getActiveTuner("BS");
    } else {
        tunerResults = tunerManager.getActiveTuner("EX");
    }

    var tunerStr = "";
    for(var i = 0; i < tunerResults.length; i++) {
        tunerStr += `<option value=\"${tunerResults[i]['id']}\">${tunerResults[i]['name']}</option>\n`;
    }

    var videoConfigs = tunerManager.getVideoSize();
    var videoStr = ""
    for(var i = 0; i < videoConfigs.length; i++) {
        videoStr += `<option value=\"${videoConfigs[i]['id']}\">${videoConfigs[i]['size']}</option>\n`;
    }

    var programStr = ""
    if(!results) {
        programStr += "番組情報が取得できませんでした。"
    } else {
        results.forEach(function(result){
            if((result["type"] == "GR" && GR) || (result["type"] == "BS" && BS) || (result["type"] == "CS" && CS) || (result["type"] == "EX" && EX)) {
                programStr += `<li><a href=\"javascript:postData('${result["sid"]}', '${result["channel"]}', '${result["name"]}')\" TARGET=\"_self\">`
                programStr += `<h3>${result["name"]}</h3>`
                programStr += `<p>${formatDate(result["starttime"])} ~ ${formatDate(result["endtime"])}</p>`
                programStr += `<p>${result["title"]}</p>`
                programStr += `<p class="wordbreak">${result["description"]}</p>`
                programStr += `</a></li>\n`;
            }
        });
    }
    htmlfile = htmlfile.replace("@@@TUNNER@@@", tunerStr);
    htmlfile = htmlfile.replace("@@@VIDEOCONFIG@@@", videoStr);
    htmlfile = htmlfile.replace("@@@TVPROGRAM@@@", programStr);
    responseFile(response, htmlfile);
}

function formatDate(result) {
     date = new Date(result);
     return ( '0' + date.getHours()).slice( -2 ) + ":" + ( '0' + date.getMinutes() ).slice( -2 );
}

