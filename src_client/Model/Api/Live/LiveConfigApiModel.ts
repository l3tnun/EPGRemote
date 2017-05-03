"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';

interface LiveConfigApiModelInterface {
    update(): void;
    setType(type: string): void;
    setHttp(http: boolean): void;
    getTunerList(): any[];
    getVideoList(): any[];
}

/**
* ライブ配信、録画配信が有効になっているかサーバから取得する
*/
class LiveConfigApiModel extends ApiModel implements LiveConfigApiModelInterface {
    private type: string | null = null;
    private http: boolean;
    private tunerList: any[] = [];
    private videoList: any[] = [];

    //server から video, tuner 情報を取得する
    public update(): void {
        if(this.type == null) { return; }

        let query = { type: this.type }
        if(this.http) { query["method"] = "http-live"; }

        this.getRequest({ method: "GET", url: `/api/live/config?${ m.buildQueryString(query) }` },
        (value: {}) => {
            this.tunerList = value["tunerList"];
            this.videoList = value["videoConfig"];
        },
        "LiveConfigApiModel update error");
    }

    /**
    * 放送波を設定
    * @param type 放送波
    */
    public setType(type: string): void {
        this.type = type;
    }

    /**
    * 配信方法を設定
    * @param http true: http 配信, false: HLS 配信
    */
    public setHttp(http: boolean): void {
        this.http = http;
    }

    public getTunerList(): any[] {
        return this.tunerList;
    }

    public getVideoList(): any[] {
        return this.videoList;
    }
}

export { LiveConfigApiModelInterface, LiveConfigApiModel };

