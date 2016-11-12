"use strict";

import WebView from './WebView';

class TopPageWebView extends WebView {
    public execute(): void {
        this.log.access.info("view 'TopPageWebView' was called.");

        let htmlFile = this.readFile('../HTML/index.html');
        this.responseFile(htmlFile == null ? "" : htmlFile);
    }
}

export default TopPageWebView;

