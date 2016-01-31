var readFile = require(__dirname + "/readFile");
var responseFile = require(__dirname + "/responseFile");
var util = require(__dirname + "/../util");

module.exports = function(response, programs) {
    var actionId = 0;
    var programStr = ""
    programs.forEach(function(program) {
        programStr += `<li data-icon="action"><a href="javascript:openProgramInfo('${program.title}', '${program.channelName}', '${program.time}', '${program.description}')" target="_self">`
        programStr += `<h3 class="wordbreak">${program.title}</h3>`
        programStr += `<p>${program.channelName} ${program.time}</p>`
        programStr += `<p class="wordbreak">${program.description}</p>`
        var edit_link;
        if(program.autorec != 0) {
            edit_link = `http://${util.getConfig()["epgrecConfig"].host}/programTable.php?keyword_id=${program.autorec}`;
        }
        programStr += `</a><a id="actionId${actionId}" href="#" programId="${program.id}" programTitle="${program.title}" programInfo="${program.channelName} ${program.time}" programTime="${program.time}" programDescription="${program.description}" programKeyword="${edit_link}" class="openActionMenu"></a></li>`
        actionId += 1;
    });

    var htmlfile = readFile("./HTML/epgrecreservationtable.html");
    htmlfile = htmlfile.replace(/@@@PROGRAM@@@/g, programStr);
    responseFile(response, htmlfile);
}

