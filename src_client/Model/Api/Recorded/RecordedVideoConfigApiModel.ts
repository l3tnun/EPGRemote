"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';

interface RecordedVideoConfigApiModelInterface {
    update(): void;
    getConfig(): { [key: string]: any }[];
}

/**
* RecordedVideoConfigApiModel
*/
class RecordedVideoConfigApiModel extends ApiModel implements RecordedVideoConfigApiModelInterface {
    private config: { [key: string]: any }[] = [];

    //config の取得
    public update(): void {
        this.getRequest({ method: "GET", url: `/api/live/config?${ m.buildQueryString({ type: "recorded" }) }` },
        (value: {}) => {
                this.config = value["videoConfig"];
        },
        "RecordedVideoConfigApiModel update error");
    }

    //config を返す
    public getConfig(): { [key: string]: any }[] {
        return this.config;
    }
}

export { RecordedVideoConfigApiModelInterface, RecordedVideoConfigApiModel }

