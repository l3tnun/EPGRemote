"use strict";

import * as m from 'mithril';
import RequestModel from '../../RequestModel';

interface RecordedSearchConfigQueryInterface {
    keyword_id?: number,
    category_id?: number,
    channel_id?: number,
    search?: string
}

interface RecordedSearchConfigApiModelInterface {
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
class RecordedSearchConfigApiModel extends RequestModel implements RecordedSearchConfigApiModelInterface {
    private keyword: { [key: string]: any }[] = [];
    private category: { [key: string]: any }[] = [];
    private channel: { [key: string]: any }[] = [];

    /**
    * keyword update
    */
    public keywordUpdate(): void {
        this.getRequest({ method: "GET", url: `/api/recorded/keyword` },
        (value: { [key: string]: any }[]) => {
            this.keyword = value;
        },
        "Recorded keyword update error");
    }

    /**
    * category update
    * @param query query
    */
    public categoryUpdate(query: RecordedSearchConfigQueryInterface): void {
        this.getRequest({
            method: "GET",
            url: `/api/recorded/category?${ m.buildQueryString(query) }`
        },
        (value: { [key: string]: any }[]) => {
            this.category = value;
        },
        "Recorded category update error");
    }

    /**
    * channel update
    * @param query query
    */
    public channelUpdate(query: RecordedSearchConfigQueryInterface): void {
        this.getRequest({
            method: "GET",
            url: `/api/recorded/channel?${ m.buildQueryString(query) }`
        },
        (value: { [key: string]: any }[]) => {
            this.channel = value;
        },
        "Recorded channel update error");
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

