"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';

interface LiveConfigApiModelInterface extends ApiModel {
    update(): void;
    setup(type: string): void;
    getTunerList(): any[];
    getVideoList(): any[];
}

/**
* ライブ配信、録画配信が有効になっているかサーバから取得する
*/
class LiveConfigApiModel implements LiveConfigApiModelInterface {
    private type: string | null = null;
    private tunerList: any[] = [];
    private videoList: any[] = [];

    //server から video, tuner 情報を取得する
    public update(): void {
        if(this.type == null) { return; }

        let query = { type: this.type }
        m.request({ method: "GET", url: `/api/live/config?${ m.route.buildQueryString(query) }` })
        .then((value) => {
            this.tunerList = value["tunerList"];
            this.videoList = value["videoConfig"];
        },
        (error) => {
            console.log('LiveConfigApiModel update error');
            console.log(error);
        });
    }

    /**
    * setup
    * @param type 放送波
    */
    public setup(type: string): void {
        this.type = type;
    }

    public getTunerList(): any[] {
        return this.tunerList;
    }

    public getVideoList(): any[] {
        return this.videoList;
    }
}

export { LiveConfigApiModelInterface, LiveConfigApiModel };

