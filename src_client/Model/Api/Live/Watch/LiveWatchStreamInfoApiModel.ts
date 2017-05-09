"use strict";

import * as m from 'mithril';
import Util from '../../../../Util/Util';
import RetryTimerApiModel from '../../RetryTimerApiModel';

interface LiveWatchStreamInfoApiModelInterface {
    update(): void;
    getInfo(): { [key: string]: any };
}

/**
* ライブ配信、録画配信が有効になっているかサーバから取得する
*/
class LiveWatchStreamInfoApiModel extends RetryTimerApiModel implements LiveWatchStreamInfoApiModelInterface {
    private info: { [key: string]: any } = {};

    /**
    * server から 指定された stream 情報を取得する
    */
    public update(): void {
        let query = Util.getCopyQuery();

        m.request({ method: "GET", url: `/api/live/watch?${ Util.buildQueryStr(query) }` })
        .then((value) => {
            this.info = value;

            let updateTime: number = value["updateTime"];
            if(typeof updateTime == "undefined") { return; }

            //timer に登録
            this.addTimer("LiveWatchStreamInfoApiModel", updateTime, () => {
                this.update();
            });
        },
        (error) => {
            console.log("LiveWatchStreamInfoApiModel update error");
            console.log(error);

            this.retryCount("LiveWatchStreamInfoApiModel", () => {
                this.update();
            })
        });
    }

    public getInfo(): { [key: string]: any } {
        return this.info;
    }
}

export { LiveWatchStreamInfoApiModelInterface, LiveWatchStreamInfoApiModel };

