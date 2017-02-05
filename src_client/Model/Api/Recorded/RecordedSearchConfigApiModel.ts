"use strict";

import * as m from 'mithril';
import Model from '../../Model';

interface RecordedSearchConfigQueryInterface {
    keyword_id?: number,
    category_id?: number,
    channel_id?: number,
    search?: string
}

interface RecordedSearchConfigApiModelInterface extends Model {
    keywordUpdate(): void;
    categoryUpdate(query: RecordedSearchConfigQueryInterface): void;
    channelUpdate(query: RecordedSearchConfigQueryInterface): void;
    getKeyword(): { [key: string]: any }[];
    getCategory(): { [key: string]: any }[];
    getChannel(): { [key: string]: any }[];
}

/**
* RecordedSearchConfigApiModel
*/
class RecordedSearchConfigApiModel implements RecordedSearchConfigApiModelInterface {
    private keyword: { [key: string]: any }[] = [];
    private category: { [key: string]: any }[] = [];
    private channel: { [key: string]: any }[] = [];

    /**
    * keyword update
    */
    public keywordUpdate(): void {
         m.request({ method: "GET", url: `/api/recorded/keyword` })
        .then((value) => {
            this.keyword = value;
        },
        (error) => {
            console.log("Recorded keyword update error");
            console.log(error);
        });
    }

    /**
    * category update
    * @param query query
    */
    public categoryUpdate(query: RecordedSearchConfigQueryInterface): void {
        m.request({
            method: "GET",
            url: `/api/recorded/category?${ m.buildQueryString(query) }`
        })
        .then((value) => {
            this.category = value;
        },
        (error) => {
            console.log("Recorded category update error");
            console.log(error);
        });
    }

    /**
    * channel update
    * @param query query
    */
    public channelUpdate(query: RecordedSearchConfigQueryInterface): void {
        m.request({
            method: "GET",
            url: `/api/recorded/channel?${ m.buildQueryString(query) }`
        })
        .then((value) => {
            this.channel = value;
        },
        (error) => {
            console.log("Recorded channel update error");
            console.log(error);
        });
    }

    //keyword を返す
    public getKeyword(): { [key: string]: any }[] {
        return this.keyword;
    }

    //category を返す
    public getCategory(): { [key: string]: any }[] {
        return this.category;
    }

    //channel を返す
    public getChannel(): { [key: string]: any }[] {
        return this.channel;
    }
}

export { RecordedSearchConfigQueryInterface, RecordedSearchConfigApiModelInterface, RecordedSearchConfigApiModel }

