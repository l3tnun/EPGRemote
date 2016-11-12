"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from './Controller';
import BadRequestWebView from '../View/WebView/BadRequestWebView';

class BadRequestController extends Controller {
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'BadRequestController' was called.");

        let view = new BadRequestWebView(response);
        view.execute();
    }
}

export default BadRequestController;

