"use strict";

import * as m from 'mithril';
import RetryApiModel from '../RetryApiModel';

interface LiveOtherStreamInfoApiModelInterface {
    update(): void;
    getList(): string[];
}

/**
* 配信中のストリーム情報を取得する
*/
class LiveOtherStreamInfoApiModel extends RetryApiModel implements LiveOtherStreamInfoApiModelInterface {
    private list: any[] = [];

    public update(): void {
        m.request({ method: "GET", url: `/api/live/watch` })
        .then((value: any[]) => {
            if(typeof value == "undefined" || value.length == 0) {
                this.list = [];
                return;
            }

            let minEndtime: number = value.pop()!["updateTime"];
            if(typeof minEndtime == "undefined") { return; }

            //timer にセット
            this.addTimer("LiveOtherStreamInfoApiModel", minEndtime);

            this.list = value;
        },
        (error) => {
            console.log("LiveOtherStreamInfoApiModel update error");
            console.log(error);

            this.retryCount("LiveOtherStreamInfoApiModel");
        })
    }

    //配信中のストリーム情報を返す
    public getList(): string[] {
        return this.list;
    }
}

export { LiveOtherStreamInfoApiModelInterface, LiveOtherStreamInfoApiModel };

