var socketio = io.connect(window.location.protocol + "//" + window.location.host);
var socketid = `${new Date().getTime()}:${Math.random().toString(36).slice(-8)}`;
