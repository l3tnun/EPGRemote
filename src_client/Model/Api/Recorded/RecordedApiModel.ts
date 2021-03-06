"use strict";

import * as m from 'mithril';
import Util from '../../../Util/Util';
import ApiModel from '../ApiModel';

interface  RecordedApiModelParamsInterface {
    search?: string,
    keyword?: number,
    category?: number,
    channel?: number,
    page?: number,
    limit?: number
}

interface RecordedApiModelInterface {
    init(): void;
    setup(option: RecordedApiModelParamsInterface): void;
    update(): void;
    getRecordedList(): any[];
    getRecordedTotalNum(): number | null;
    getRecordedLimit(): number | null;
}

/**
* 録画済み一覧を取得する
*/
class RecordedApiModel extends ApiModel implements RecordedApiModelInterface {
    private option: RecordedApiModelParamsInterface = {};
    private recordedList: any[] = [];
    private totalNum: number | null = null;
    private limit: number | null = null;

    public init(): void {
        this.option = {};
        this.recordedList = [];
        this.totalNum = null;
        this.limit = null;
        m.redraw();
    }

    public setup(_option: RecordedApiModelParamsInterface): void {
        this.option = _option;
    }

    public update(): void {
        let query = {};
        for(let key in this.option) {
            if(this.option[key] != null && typeof this.option[key] != "undefined") {
                query[key] = this.option[key];
            }
        }

        this.getRequest({ method: "GET", url: `/api/recorded?${ m.buildQueryString(query) }` },
        (value: {}) => {
            let programs = value["programs"];
            let totalNum = value["totalNum"];
            let limit = value["limit"];

            if(typeof programs != "undefined" && typeof totalNum != "undefined" && typeof limit != "undefined") {
                programs.map((program: any) => {  program.thumbs = Util.encodeURL(program.thumbs); });
                this.recordedList = programs;
                this.totalNum = totalNum;
                this.limit = limit;
            }
        },
        "RecordedApiModel update error");
    }

    public getRecordedList(): any[] {
        return this.recordedList;
    }

    public getRecordedTotalNum(): number | null {
        return this.totalNum;
    }

    public getRecordedLimit(): number | null {
        return this.limit;
    }
}

export { RecordedApiModelParamsInterface, RecordedApiModelInterface, RecordedApiModel }

