var query = null;
function getQuery() {
    if(query != null) { return query; }
    query = {};

    var str = location.href.split("?");
    if(typeof str[1] != "undefined") {
        var paramms = str[1].split("&");

        for(var i = 0; i < paramms.length; i++) {
            var para = paramms[i].split("=");
            query[para[0]] = para[1];
        }
    }

    return query;
}

