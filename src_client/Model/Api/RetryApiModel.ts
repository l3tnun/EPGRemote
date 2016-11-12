"use strict";

import ApiModel from './ApiModel';
import TimerManager from '../../Util/TimerManager';

/**
* ApiModel に Retry 機能を追加
*/
abstract class RetryApiModel extends ApiModel {
    protected retry: number = 0;

    //json の取得
    public abstract update(...args: any[]): void;

    /**
    * timer に追加
    * update 終了時に呼び出す
    */
    protected addTimer(name: string, time: number, callback: Function | null = null): void {
        TimerManager.getInstance().add(name, time, () => {
            this.retry = 0;
            if(callback == null) {
                this.update();
            } else {
                callback();
            }
        });
    }

    //retry 処理
    protected retryCount(name: string, callback: Function | null = null): void {
        if(this.retry < 5) {
            this.retry += 1;
            setTimeout(() => {
                if(callback == null) {
                    this.update();
                } else {
                    callback();
                }
            }, this.getRandTime());
        } else {
            console.log(name + " retry countout");
            this.retry = 0;
        }
    }

    //10 ~ 20 * 1000 の乱数を返す
    private getRandTime(): number {
        return Math.floor(Math.random()*(10-1)+10) * 1000;
    }
}

export default RetryApiModel;

