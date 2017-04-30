"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';

interface LogPageApiModelInterface {
    update(level0: boolean, level1: boolean, level2: boolean, level3: boolean): void;
    getLogList(): any[];
}

/**
* ライブ配信、録画配信が有効になっているかサーバから取得する
*/
class LogPageApiModel extends ApiModel implements LogPageApiModelInterface {
    private logList: any[] = [];

    /**
    * server から log 情報を取得する
    * @param level0 info
    * @param level1 warning
    * @param level2 error
    * @param level3 debug
    */
    public update(level0: boolean = false, level1: boolean = false, level2: boolean = false, level3: boolean = false): void {
        let query = {
            info:   level0 ? 1 : 0,
            warning: level1 ? 1 : 0,
            error:  level2 ? 1 : 0,
            debug:  level3 ? 1 : 0
        }

        this.getRequest({ method: "GET", url: `/api/log?${ m.buildQueryString(query) }` },
        (value: any[]) => {
            this.logList = value;
        },
        "LogPageApiModel update error", 10);
    }

    //logList を返す
    public getLogList(): any[] {
        return this.logList;
    }
}

export { LogPageApiModelInterface, LogPageApiModel };

