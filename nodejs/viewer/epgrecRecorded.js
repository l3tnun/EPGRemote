var readFile = require(__dirname + "/readFile");
var responseFile = require(__dirname + "/responseFile");

module.exports = function(response, programs) {
    var actionId = 0;
    var programStr = ""
    programs.forEach(function(program) {
        programStr += `<li data-icon="action"><a href="${program.videLink}" target="_self">`
        programStr += `<img src="${program.thumbs}">`
        programStr += `<h3>${program.title}</h3>`
        programStr += `<p>${program.info}</p>`
        programStr += `<p>${program.description}</p>`
        //programStr += `</a><a href="javascript:openDeleteDialog(${program.id}, '${program.title}')"></a></li>`
        programStr += `</a><a id="actionId${actionId}" href="#" programId="${program.id}" programTitle="${program.title}" class="openActionMenu"></a></li>`
        actionId += 1;
    });

    var htmlfile = readFile("./HTML/epgrecrecorded.html");
    htmlfile = htmlfile.replace(/@@@PROGRAM@@@/g, programStr);
    responseFile(response, htmlfile);
}

