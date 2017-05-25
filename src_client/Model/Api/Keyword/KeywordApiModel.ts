"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';
import Util from '../../../Util/Util';

interface KeywordApiModelInterface {
    init(): void;
    setup(page: number | null, limit: number | null): void;
    update(): void;
    getKeywords(): { [key: string]: any }[];
    getKeywordLimit(): number;
    getKeywordTotalNum(): number;
}

/**
* キーワード一覧をサーバから取得する
*/
class KeywordApiModel extends ApiModel implements KeywordApiModelInterface {
    private keywords: { [key: string]: any }[] = [];
    private page: number | null = null;
    private limit: number | null = null;
    private totalNum: number = 0;

    public init(): void {
        this.keywords = [];
        this.page = null;
        this.limit = null;
        this.totalNum = 0;
        m.redraw();
    }

    public setup(_page: number | null, _limit: number | null): void {
        this.page = _page;
        this.limit = _limit;
    }

    public update(): void {
        let query = {};

        if(this.page != null) { query["page"] = this.page; }
        if(this.limit != null) { query["limit"] = this.limit; }

        this.getRequest({ method: "GET", url: `/api/keyword?${ m.buildQueryString(query) }` },
        (value: {}) => {
            let keywords = value["keywords"];
            let limit = value["limit"];
            let totalNum = value["totalNum"];

            if(typeof keywords == "undefined" || typeof limit == "undefined" || typeof totalNum == "undefined") {
                return;
            }

            keywords.map((keyword: { [key: string]: any }) => {
                //必要な要素を加工する
                keyword["types"] = this.getTypes(keyword);
                keyword["option"] = this.getOption(keyword);
                keyword["time"] = this.getTime(keyword["startTime"], keyword["periodTime"]);
                keyword["sft_start"] = this.getSft(keyword["sft_start"]);
                keyword["sft_end"] = this.getSft(keyword["sft_end"]);
                keyword["weekofdays"] = this.getWeekofdays(keyword);
                keyword["discontinuity"] = keyword["discontinuity"] ? "◯" : "☓";

                //余分な要素を削除する
                delete keyword["autorec_mode"];
                delete keyword["category_id"];
                delete keyword["channel_id"];
                delete keyword["typeGR"];
                delete keyword["typeBS"];
                delete keyword["typeCS"];
                delete keyword["typeEX"];
                delete keyword["use_regexp"];
                delete keyword["collate_ci"];
                delete keyword["ena_title"];
                delete keyword["ena_desc"];
                delete keyword["overlap"];
                delete keyword["split_time"];
                delete keyword["rest_alert"];
                delete keyword["criterion_dura"];
                delete keyword["startTime"];
                delete keyword["periodTime"];
            });

            this.keywords = keywords;
            this.limit = limit;
            this.totalNum = totalNum;
        },
        "KeywordApiModel update error");
    }

    public getKeywords(): { [key: string]: any }[] {
        return this.keywords;
    }

    public getKeywordLimit(): number {
        return this.limit == null ? 0 : this.limit;
    }

    public getKeywordTotalNum(): number {
        return this.totalNum;
    }

    //放送波を取得
    private getTypes(keyword: { [key: string]: any } ): string {
        let str = "";

        if(keyword["typeGR"]) { str += "GR "; }
        if(keyword["typeBS"]) { str += "BS "; }
        if(keyword["typeCS"]) { str += "CS "; }
        if(keyword["typeEX"]) { str += "EX "; }

        return str;
    }

    //オプションを取得
    private getOption(keyword: { [key: string]: any }): string {
        let options = "";

        if(keyword["use_regexp"]) { options += "正"; }
        else if(keyword["collate_ci"]) { options += "全"; }
        else { options += "－"; }

        options += keyword["ena_title"] ? "タ" : "－";
        options += keyword["ena_desc"] ? "概" : "－";

        options += ":";

        if(keyword["overlap"]) { options += "多"; }
        else if(keyword["split_time"]) { options += "分"; }
        else { options += "－"; }

        options += keyword["rest_alert"] ? "無" : "－";
        options += keyword["criterion_dura"] ? "幅" : "－";

        return options;
    }

    //時刻取得
    private getTime(prgtime: number, period: number): string[] {
        return (prgtime == 24) ? ["なし"] : [`${prgtime}時`, `〜${period}H`];
    }

    //時刻シフト取得
    private  getSft(sft_time: number): string {
        let h = sft_time / 3600 | 0;
        let m = sft_time % 3600 / 60 | 0;
        let s = sft_time % 60;

        return `${ Util.strZeroPlus(h, 2) }:${ Util.strZeroPlus(m, 2) }:${ Util.strZeroPlus(s, 2) }`;
    }

    //曜日取得
    private getWeekofdays(keyword: { [key: string]: any }): string {
        if( Util.hashSize(keyword["weekofdays"]) == 7 ) {
            return "-";
        }

        let str = "";

        if(keyword["weekofdays"][0]) { str += "月 "; }
        if(keyword["weekofdays"][1]) { str += "火 "; }
        if(keyword["weekofdays"][2]) { str += "水 "; }
        if(keyword["weekofdays"][3]) { str += "木 "; }
        if(keyword["weekofdays"][4]) { str += "金 "; }
        if(keyword["weekofdays"][5]) { str += "土 "; }
        if(keyword["weekofdays"][6]) { str += "日 "; }

        return str;
    }
}

export { KeywordApiModelInterface, KeywordApiModel };

