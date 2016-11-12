"use strict";

import * as m from 'mithril';
import RetryApiModel from '../../RetryApiModel';

interface LiveWatchStreamInfoApiModelInterface {
    update(streamId: number): void;
    getInfo(): { [key: string]: any };
}

/**
* ライブ配信、録画配信が有効になっているかサーバから取得する
* @throw LiveWatchStreamInfoApiStreamIdError update の streamId が null の場合に発生する
*/
class LiveWatchStreamInfoApiModel extends RetryApiModel implements LiveWatchStreamInfoApiModelInterface {
    private info: { [key: string]: any } = {};

    /**
    * server から 指定された stream 情報を取得する
    * @throw LiveWatchStreamInfoApiStreamIdError update の streamId が null の場合に発生する
    */
    public update(streamId: number): void {
        if(streamId == null) {
            throw new Error("LiveWatchStreamInfoApiStreamIdError");
        }

        m.request({ method: "GET", url: `/api/live/watch?stream=${ streamId }` })
        .then((value) => {
            this.info = value;

            let updateTime: number = value["updateTime"];
            if(typeof updateTime == "undefined") { return; }

            //timer に登録
            this.addTimer("LiveWatchStreamInfoApiModel", updateTime, () => {
                this.update(streamId);
            });
        },
        (error) => {
            console.log("LiveWatchStreamInfoApiModel update error");
            console.log(error);

            this.retryCount("LiveWatchStreamInfoApiModel", () => {
                this.update(streamId);
            })
        });
    }

    public getInfo(): { [key: string]: any } {
        return this.info;
    }
}

export { LiveWatchStreamInfoApiModelInterface, LiveWatchStreamInfoApiModel };

