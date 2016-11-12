"use strict";

import WebView from './WebView';

class NotFoundWebView extends WebView {
    public execute(): void {
        this.log.access.info("view 'NotFoundWebView' was called.");
        this.response.writeHead(404, {"Content-Type": "text/plain"});
        this.response.write("404 Not Found.\n");
        this.response.end();
    }
}

export default NotFoundWebView;

