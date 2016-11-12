"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';

interface LiveConfigEnableApiModelInterface extends ApiModel {
    update(): void;
    getLive(): boolean;
    getRecorded(): boolean;
}

/**
* ライブ配信、録画配信が有効になっているかサーバから取得する
*/
class LiveConfigEnableApiModel implements LiveConfigEnableApiModelInterface {
    private enableLive: boolean = false;
    private enableRecorded: boolean = false;

    public update(): void {
        m.request({ method: "GET", url: `/api/live/config/enable` })
        .then((value) => {
            this.enableLive = value["enableLiveStream"];
            this.enableRecorded = value["enableRecordedStream"];
        },
        (error) => {
            console.log('LiveConfigEnableApiModel update error');
            console.log(error);
        });
    }

    /**
    * ライブ視聴が有効か返す
    * 有効なら true, 無効なら false
    */
    public getLive(): boolean {
        return this.enableLive;
    }

    /**
    * 録画配信が有効か返す
    * 有効なら true, 無効なら false
    */
    public getRecorded(): boolean {
        return this.enableRecorded;
    }
}

export { LiveConfigEnableApiModelInterface, LiveConfigEnableApiModel };

