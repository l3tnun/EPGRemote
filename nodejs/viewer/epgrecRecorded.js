var log = require(__dirname + "/../logger").getLogger();
var readFile = require(__dirname + "/readFile");
var responseFile = require(__dirname + "/responseFile");

module.exports = function(response, programs, programCnt, pageNum) {
    log.access.info("viewer 'epgrecRecorded' was called.");
    var actionId = 0;
    var programStr = ""
    programs.forEach(function(program) {
        programStr += `<li data-icon="action"><a href="javascript:getVideoList('${program.id}');" target="_self">`
        programStr += `<img src="${program.thumbs}">`
        programStr += `<h3>${program.title}</h3>`
        programStr += `<p>${program.info} ${program.channel_name}</p>`
        programStr += `<p>${program.description}</p>`
        programStr += `</a><a id="actionId${actionId}" href="#" programId="${program.id}" programTitle="${program.title}" programInfo="${program.info}" programChannelName="${program.channel_name}" programDescription="${program.description}" programThumbs="${program.thumbs}" class="openActionMenu"></a></li>`
        actionId += 1;
    });

    var htmlfile = readFile("./HTML/epgrecrecorded.html");
    htmlfile = htmlfile.replace(/@@@PROGRAM@@@/g, programStr);
    htmlfile = htmlfile.replace(/@@@PAGENEXT@@@/g, `<input id="page_next" style="display: none;" value="${(pageNum * 15 - programCnt == 0)}"/>`);
    responseFile(response, htmlfile);
}

