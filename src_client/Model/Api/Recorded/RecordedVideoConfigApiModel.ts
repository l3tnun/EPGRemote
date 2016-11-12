"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';

interface RecordedVideoConfigApiModelInterface extends ApiModel {
    update(): void;
    getConfig(): { [key: string]: any }[];
}

/**
* RecordedVideoConfigApiModel
*/
class RecordedVideoConfigApiModel implements RecordedVideoConfigApiModelInterface {
    private config: { [key: string]: any }[] = [];

    //config の取得
    public update(): void {
        m.request({method: "GET", url: `/api/live/config?${ m.route.buildQueryString({ type: "recorded" }) }`})
        .then((value) => {
                this.config = value["videoConfig"];
        },
        (error) => {
            console.log("RecordedVideoConfigApiModel update error");
            console.log(error);
        });
    }

    //config を返す
    public getConfig(): { [key: string]: any }[] {
        return this.config;
    }
}

export { RecordedVideoConfigApiModelInterface, RecordedVideoConfigApiModel }

