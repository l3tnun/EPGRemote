"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';

interface SearchResultOptionInterface {
    search: string;
    use_regexp: boolean;
    collate_ci: boolean;
    ena_title: boolean;
    ena_desc: boolean;
    typeGR: boolean;
    typeBS: boolean;
    typeCS: boolean;
    typeEX: boolean;
    first_genre: boolean;
    period: number;
    week0: boolean;
    week1: boolean;
    week2: boolean;
    week3: boolean;
    week4: boolean;
    week5: boolean;
    week6: boolean;
    channel_id: number;
    category_id: number;
    sub_genre: number;
    prgtime: number;
}

interface SearchResultApiModelInterface extends ApiModel {
    init(): void;
    setOption(option: SearchResultOptionInterface): void;
    update(): void;
    getResult(): { [key: string]: any }[];
}

/**
* search の検索結果を取得する
*/
class SearchResultApiModel implements SearchResultApiModelInterface {
    private result: { [key: string]: any }[] = [];
    private option: SearchResultOptionInterface | null = null;

    public init(): void {
        this.result = [];
    }

    public setOption(option: SearchResultOptionInterface): void {
        this.option = option;
    }

    public update(): void {
        let query = {};

        if(this.option == null) {
            console.log("SearchResultApiModel option is null");
            return;
        }

        query["search"] = this.option.search;
        if(this.option.use_regexp) { query["use_regexp"] = 1; }
        if(this.option.collate_ci) { query["collate_ci"] = 1; }
        if(this.option.ena_title) { query["ena_title"] = 1; }
        if(this.option.ena_desc) { query["ena_desc"] = 1; }
        if(this.option.typeGR) { query["typeGR"] = 1; }
        if(this.option.typeBS) { query["typeBS"] = 1; }
        if(this.option.typeCS) { query["typeCS"] = 1; }
        if(this.option.typeEX) { query["typeEX"] = 1; }
        if(this.option.first_genre) { query["first_genre"] = 1; }
        query["period"] = this.option.period;
        if(this.option.week0) { query["week0"] = 1; }
        if(this.option.week1) { query["week1"] = 1; }
        if(this.option.week2) { query["week2"] = 1; }
        if(this.option.week3) { query["week3"] = 1; }
        if(this.option.week4) { query["week4"] = 1; }
        if(this.option.week5) { query["week5"] = 1; }
        if(this.option.week6) { query["week6"] = 1; }
        if(this.option.channel_id != 0) { query["channel_id"] = this.option.channel_id; }
        if(this.option.category_id != 0) { query["category_id"] = this.option.category_id; }
        if(this.option.sub_genre != 0) { query["sub_genre"] = this.option.sub_genre; }
        if(this.option.prgtime != 0) { query["prgtime"] = this.option.prgtime; }

        m.request({
            method: "POST",
            url: `/api/search`,
            data: m.buildQueryString(query)
        })
        .then((value) => {
            if(value["status"] == "completed") {
                this.result = value["program"];
            } else {
                console.log("SearchResultApiModel update failed");
            }
        },
        (error) => {
            console.log("SearchResultApiModel update error");
            console.log(error);
        });
    }

    public getResult(): { [key: string]: any }[] {
        return this.result;
    }
}

export { SearchResultOptionInterface, SearchResultApiModelInterface, SearchResultApiModel };

