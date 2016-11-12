"use strict";

import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import View from '../View';

abstract class WebView extends View {
    protected response: http.ServerResponse;

    constructor (_response: http.ServerResponse) {
        super();
        this.response = _response;
    }

    protected responseFile(str: string, head: { [key: string]: string; } | null = null): void {
        this.log.access.info("viewer 'responseFile' was called.");

        if(typeof str == "undefined") {
            //404
            this.response.writeHead(404, {"Content-Type": "text/plain"});
            this.response.write("404 Not found\n");
        } else if(head != null) {
            this.response.writeHead(200, head);
            this.response.write(str);
        } else {
            this.response.writeHead(200,{'content-Type': 'text/html'});
            this.response.write(str);
        }

        this.response.end();
    }

    protected readFile(filePath: string): string | null {
        this.log.access.info(`viewer readfile ${filePath}`);
        let fullFilePath = path.join(this.config.getRootPath(), filePath);

        try {
            return fs.readFileSync(fullFilePath, 'utf-8');
        } catch (e) {
            this.log.access.error("file not found");
            return null;
        }

    }

    public abstract execute(): void;
}

export default WebView;

