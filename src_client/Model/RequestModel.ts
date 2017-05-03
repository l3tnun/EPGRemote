"use strict";

import * as m from 'mithril';
import Model from './Model';

/**
* Model 抽象クラス
*/

interface requestOptions {
    method: string;
    url: string;
    data?: string;
    config?: (xhr: XMLHttpRequest) => void;
}

abstract class RequestModel extends Model {
    private retryCnt = 0;

    protected getRequest(option: requestOptions, callback: Function | null = null, errorCallback: Function | string | null = null, timeout: number = 5): void {
        //timeout の設定
        option.config = (xhr: XMLHttpRequest) => {
            xhr.timeout = 1000 * timeout;
        }

        m.request(option)
        .then((value: {}) => {
            this.retryCnt = 0;

            if(callback == null) { return; }
            callback(value);
        },
        (error: string) => {
            this.retryCnt += 1;
            if(this.retryCnt > 2) {
                this.retryCnt = 0;

                if(errorCallback == null) { return; }

                if(typeof errorCallback == "string") {
                    console.log(errorCallback);
                    console.log(error);
                } else {
                    errorCallback(error);
                }
            } else {
                this.getRequest(option, callback, errorCallback, timeout);
            }
        });
    }
}

export default RequestModel;

