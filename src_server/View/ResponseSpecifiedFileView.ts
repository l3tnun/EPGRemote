"use strict";

import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import View from './View';
import FileTypeModule from '../FileTypeModule';
import ResponseSpecifiedFileModel from '../Model/ResponseSpecifiedFileModel';

class ResponseSpecifiedFile extends View {
    protected response: http.ServerResponse;
    private request: http.ServerRequest;
    private mode: string | null = null;

    constructor (_response: http.ServerResponse, _request: http.ServerRequest, _mode: string) {
        super();
        this.response = _response;
        this.request = _request;
        this.mode = _mode;
    }

    public execute(): void {
        this.log.access.info("view 'ResponseSpecifiedFileView' was called.");
        let filePath = (<ResponseSpecifiedFileModel>this.getModel("ResponseSpecifiedFileModel")).getFilePath();

        try {
            if(fs.statSync(filePath).isDirectory()) {
                this.log.access.error(`${filePath} is directory`);
                this.notFound();
            } else {
                let responseHeaders: {} = {};
                if(typeof this.mode != "undefined" && this.mode == "download") {
                    this.log.access.info(`response ${filePath} mode download`);
                    responseHeaders['Content-Type'] = 'application/octet-stream';
                    responseHeaders['Content-disposition'] = "attachment; filename*=utf-8'ja'" + encodeURIComponent(path.basename(filePath)) + ";"
                } else {
                    this.log.access.info(`response ${filePath}`);
                    responseHeaders['Content-Type'] = FileTypeModule.types[path.extname(filePath)];
                }

                let stat = fs.statSync(filePath);
                let rangeRequest = this.readRangeHeader(this.request.headers['range'], stat.size);

                if (rangeRequest == null) {
                    responseHeaders['Content-Length'] = stat.size;  // File size.
                    responseHeaders['Accept-Ranges'] = 'bytes';

                    this.sendResponse(200, responseHeaders, fs.createReadStream(filePath));
                    return;
                }

                let start: number = rangeRequest.Start;
                let end: number = rangeRequest.End;

                if (start >= stat.size || end >= stat.size) {
                    responseHeaders['Content-Range'] = 'bytes */' + stat.size; // File size.
                    this.sendResponse(416, responseHeaders, null);
                    return;
                }

                responseHeaders['Content-Range'] = 'bytes ' + start + '-' + end + '/' + stat.size;
                responseHeaders['Content-Length'] = start == end ? 0 : (end - start + 1);
                responseHeaders['Accept-Ranges'] = 'bytes';
                responseHeaders['Cache-Control'] = 'no-cache';

                //typings で start と end の定義がないため、エラー回避
                let option = { start: start, end: end };
                let stream = fs.createReadStream(filePath, option);
                this.sendResponse(206, responseHeaders, stream);
            }
        } catch(e) {
            this.log.access.info(`${filePath} is not found`);
            this.notFound();
        }
    }

    private readRangeHeader(range: string | null, totalLength: number): { Start: number, End: number } | null {
        if (range == null || range.length == 0) { return null; }

        let array = range.split(/bytes=([0-9]*)-([0-9]*)/);
        let start = parseInt(array[1]);
        let end = parseInt(array[2]);
        let result = {
            Start: isNaN(start) ? 0 : start,
            End: isNaN(end) ? (totalLength - 1) : end
        };

        if(!isNaN(start) && isNaN(end)) {
            result.Start = start;
            result.End = totalLength - 1;
        }

        if(isNaN(start) && !isNaN(end)) {
            result.Start = totalLength - end;
            result.End = totalLength - 1;
        }

        return result;
    }

    private sendResponse(responseStatus: number, responseHeaders: {}, readable: fs.ReadStream | null): void {
        this.response.writeHead(responseStatus, responseHeaders);

        if (readable == null) {
            this.response.end();
        } else {
            readable.on('open', () => {
                readable.pipe(this.response);
            });
        }
    }

    private notFound(): void {
        this.response.writeHead(404, {"Content-Type": "text/plain"});
        this.response.write("404 Not Found.\n");
        this.response.end();
    }
}

export default ResponseSpecifiedFile;

