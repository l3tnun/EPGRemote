"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from './Controller';
import TopPageWebView from '../View/WebView/TopPageWebView';

class TopPageController extends Controller {
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'TopPageController' was called.");

        new TopPageWebView(response).execute();
    }
}

export default TopPageController;

