"use strict";

import * as http from 'http';
import * as request from 'request';
import Base from '../Base';

abstract class EpgrecOperater extends Base {
    protected hostUrl: string = this.config.getConfig().epgrecConfig.host;

    protected httpGet(
        url: string,
        name: string,
        callback: (value: string) => void,
        errCallback: (value: { [key: string]: any }) => void,
        timeoutCallback?: (value: { [key: string]: any }) => void
    ): void {
        if(typeof timeoutCallback == "undefined") { timeoutCallback = errCallback; }

        this.log.system.info('EpgrecOperater http get ' + name);

        let timeout = false;
        let req = http.get(url, (res: http.IncomingMessage) => {
            let body = '';
            res.setEncoding('utf8');

            res.on('data', (chunk) => { body += chunk; });

            res.on('end', () => { callback(body); });
        }).on('error',(e) => {
            if(timeout) { return; }
            this.log.system.error('EpgrecOperater failed http get ' + name)
            this.log.system.error(e.message);
            errCallback({ code: 500 });
        });

        req.setTimeout(1000);

        req.on('timeout', () => {
            this.log.system.info('request timed out');
            timeout = true;
            req.abort();
            if(typeof timeoutCallback != "undefined") {
                timeoutCallback({ code: 500 });
            }
        });
    }

    protected httpPost(
        url: string,
        option: { [key: string]: any },
        name: string,
        callback: (value: string) => void,
        errCallback: (value: { [key: string]: any }) => void
    ): void {
        this.log.system.info('http post ' + name);

        request.post(
            url,
            { form: option },
            (error: any, _res: http.IncomingMessage, body: any) => {
                if (error) {
                    this.log.system.error('failed http post ' + name);
                    this.log.system.error(error);
                    errCallback({ code: 500 });
                }
                callback(body);
            }
        );
    }

    public abstract execute(option: { [key: string]: any }, callback: (value: string) => void, errCallback: (value: { [key: string]: any }) => void, timeoutCallback?: (value: { [key: string]: any }) => void): void;
}

export default EpgrecOperater;

