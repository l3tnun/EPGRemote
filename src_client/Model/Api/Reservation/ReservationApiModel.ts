"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';

interface ReservationApiModelInterface extends ApiModel {
    setup(page: number | null, limit: number | null): void;
    update(): void;
    getPrograms(): { [key: string]: any }[];
    getProgramLimit(): number | null;
    getProgramTotalNum(): number;
}

/**
* ライブ配信、録画配信が有効になっているかサーバから取得する
*/
class ReservationApiModel implements ReservationApiModelInterface {
    private programs: { [key: string]: any }[] = [];
    private page: number | null = null;
    private limit: number | null = null;
    private totalNum: number = 0;

    public setup(_page: number | null, _limit: number | null): void {
        this.page = _page;
        this.limit = _limit;
    }

    public update(): void {
        let query = {};

        if(this.page != null) { query["page"] = this.page; }
        if(this.limit != null) { query["limit"] = this.limit; }

        m.request({method: "GET", url: `/api/reservation?${ m.buildQueryString(query) }`})
        .then((value) => {
            let prgorams = value["programs"];
            let limit = value["limit"];
            let totalNum = value["totalNum"];

            if(typeof prgorams != "undefined" && typeof limit != "undefined" && typeof totalNum != "undefined") {
                this.programs = prgorams;
                this.limit = limit;
                this.totalNum = totalNum;
            }
        },
        (error) => {
            console.log("ReservationApiModel update error");
            console.log(error);
        });
    }

    public getPrograms(): { [key: string]: any }[] {
        return this.programs;
    }

    public getProgramLimit(): number | null {
        return this.limit;
    }

    public getProgramTotalNum(): number {
        return this.totalNum;
    }
}

export { ReservationApiModelInterface, ReservationApiModel };

