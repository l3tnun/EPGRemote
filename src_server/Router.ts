"use strict";

import * as http from 'http';
import * as url from 'url';
import * as path from 'path';
import Base from './Base';
import Controller from './Controller/Controller';
import FileTypeModule from './FileTypeModule';

/**
* Router
*/
class Router extends Base {
    private handle: { [key: string]: Controller } = {};

    constructor(_handle: { [key: string]: Controller }) {
        super();
        this.handle = _handle;
    }

    public route(parsedUrl: url.Url, request: http.ServerRequest, response: http.ServerResponse, postData: string): void {
        parsedUrl.pathname = this.getPathname(parsedUrl.pathname!);
        this.log.access.info("Access " + request.connection.remoteAddress + " : " + request.headers['user-agent']);
        this.log.access.info("About to route a request for " + parsedUrl.pathname);

        let pagePath = parsedUrl.pathname! + ":" + request.method!.toUpperCase();
        if(this.checkQuery(parsedUrl.query) == false) {
            this.handle["_bad_request"].execute(parsedUrl, request, response, postData);
        } else if ( FileTypeModule.hasType( path.extname(parsedUrl.pathname!) ) ) {
            this.handle["_spcified_file"].execute(parsedUrl, request, response, postData);
        } else if(typeof this.handle[pagePath] != 'undefined') {
            this.handle[pagePath].execute(parsedUrl, request, response, postData);
        } else {
            this.handle["_not_found"].execute(parsedUrl, request, response, postData);
        }
    }

    private getPathname(pathname: string): string {
        if(pathname.length > 1 && pathname.charAt(pathname.length - 1) == "/") {
            return pathname.slice(0, -1);
        }
        return pathname;
    }

    private checkQuery(query: { [key: string]: string }): boolean {
        for(let key in query){ if(typeof query[key] != "string") { return false; } }
        return true;
    }
}

export default Router;

