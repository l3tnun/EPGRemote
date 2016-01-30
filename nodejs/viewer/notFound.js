module.exports = function(response, str) {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found\n");
    if(typeof str != "undefined") { response.write(str); }
    response.end();
}

