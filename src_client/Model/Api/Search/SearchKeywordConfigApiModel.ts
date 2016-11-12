"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';

interface SearchKeywordConfigValue {
    id: number;
    keyword: string;
    use_regexp: boolean;
    collate_ci: boolean;
    ena_title: boolean;
    ena_desc: boolean;
    overlap: boolean;
    rest_alert: boolean;
    criterion_dura: boolean;
    discontinuity: boolean;
    split_time: number;
    kw_enable: boolean;
    channel_name: string;
    channel_id: number;
    category_name: string;
    category_id: number;
    subGenre: string;
    subGenre_id: number;
    typeGR: boolean;
    typeBS: boolean;
    typeCS: boolean;
    typeEX: boolean;
    weekofdays: {
        0: boolean,
        1: boolean,
        2: boolean,
        3: boolean,
        4: boolean,
        5: boolean,
        6: boolean
    }
    startTime: number;
    periodTime: number;
    priority: number;
    sft_start: number;
    sft_end: number;
    autorec_mode_name: string;
    autorec_mode: number;
    firstGenre: boolean;
    directory: string;
    filenameFormat: string;
    recordedNum: number;
    transConfig: {
        mode: number,
        dir: string
    }[];
    ts_del: boolean;
}

interface SearchKeywordConfigApiModelInterface extends ApiModel {
    update(keyword_id: number, callback?: Function): void;
    getConfig(): SearchKeywordConfigValue | null;
}

/**
* search の keyword_id 指定時の設定を取得する
*/
class SearchKeywordConfigApiModel implements SearchKeywordConfigApiModelInterface {
    private config: SearchKeywordConfigValue | null = null;

    public update(keyword_id: number, callback: Function | null = null): void {
        m.request({method: "GET", url: "/api/keyword?keyword_id=" + keyword_id })
        .then((value) => {
            this.config = <SearchKeywordConfigValue>value["keyword"];
            this.config.sft_start = Math.floor(this.config.sft_start / 60);
            this.config.sft_end = Math.floor(this.config.sft_end / 60);
            this.config.split_time = Math.floor(this.config.split_time / 60);

            if(callback != null) {
                callback();
            }
        },
        (error) => {
            console.log("SearcgKeywordConfigApiModel update error");
            console.log(error);
        });
    }

    public getConfig(): SearchKeywordConfigValue | null{
        return this.config;
    }
}

export { SearchKeywordConfigValue, SearchKeywordConfigApiModelInterface, SearchKeywordConfigApiModel };

