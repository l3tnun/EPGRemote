"use strict";

import * as m from 'mithril';
import RetryApiModel from '../RetryApiModel';

interface LiveProgramApiModelInterface {
    init(): void;
    update(): void;
    getList(): { [key: string]: any } [];
    setType(type: string): void;
    setTime(time: number): void;
}

/**
* 放送中の番組一覧を取得する
*/
class LiveProgramApiModel extends RetryApiModel implements LiveProgramApiModelInterface {
    private list: { [key: string]: any }[] = [];
    private type: string | null = null;
    private time: number = 0;

    //list の初期化
    public init(): void {
        this.list = [];
        this.time = 0;
        this.retry = 0;
    }

    //更新
    public update(): void {
        if(this.type == null) {
            console.log('type is not setting.');
            return;
        }

        let query = {
            type: this.type,
            time: this.time
        }

        m.request({ method: "GET", url: `/api/live/program?${ m.buildQueryString(query) }` })
        .then((value: { [key: string]: any }[]) => {
            if(typeof value == "undefined" || value.length == 0) {
                this.list = [];
                return;
            }

            let minEndtime = value.pop()!["updateTime"];
            if(typeof minEndtime == "undefined") { return; }

            this.addTimer("LiveProgramApiModel", <number>minEndtime);

            this.list = value;
        },
        (error) => {
            console.log("LiveProgramApiModel update error");
            console.log(error);

            this.retryCount("LiveProgramApiModel");
        });
    }

    // 番組一覧の取得
    public getList(): { [key: string]: any }[] {
        return this.list;
    }

    /**
    * 放送波設定
    * @param type 放送波
    */
    setType(type: string): void {
        this.type = type;
    }

    /**
    * 時間設定
    * @param time 時間(分)
    */
    setTime(time: number): void {
        this.time = time;
    }
}

export { LiveProgramApiModel, LiveProgramApiModelInterface };

