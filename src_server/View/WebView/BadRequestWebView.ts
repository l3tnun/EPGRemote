"use strict";

import WebView from './WebView';

class BadRequestdWebView extends WebView {
    public execute(): void {
        this.log.access.info("view 'BadRequestWebView' was called.");
        this.response.writeHead(400, {"Content-Type": "text/plain"});
        this.response.write("400 Bad request.\n");
        this.response.end();
    }
}

export default BadRequestdWebView;

