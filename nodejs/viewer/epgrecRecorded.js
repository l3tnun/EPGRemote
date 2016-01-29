var readFile = require(__dirname + "/readFile");
var responseFile = require(__dirname + "/responseFile");

module.exports = function(response, programs) {
    var programStr = ""
    programs.forEach(function(program) {
        programStr += `<li data-icon="delete"><a href="${program.videLink}" target="_self">`
        programStr += `<img src="${program.thumbs}">`
        programStr += `<h3>${program.title}</h3>`
        programStr += `<p>${program.info}</p>`
        programStr += `<p>${program.description}</p>`
        programStr += `</a><a href="javascript:openDeleteDialog(${program.id}, '${program.title}')"></a></li>`
    });

    var htmlfile = readFile("./HTML/epgrecrecorded.html");
    htmlfile = htmlfile.replace(/@@@PROGRAM@@@/g, programStr);
    responseFile(response, htmlfile);
}

