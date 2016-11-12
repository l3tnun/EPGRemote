"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from './Controller';
import NotFoundWebView from '../View/WebView/NotFoundWebView';

class NotFoundController extends Controller {
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'NotFoundController' was called.");

        let view = new NotFoundWebView(response);
        view.execute();
    }
}

export default NotFoundController;

