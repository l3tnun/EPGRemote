"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';
import Util from '../../../Util/Util';
import DateUtil from '../../../Util/DateUtil';

interface ProgramApiOptionInterface {
    type?: string;
    time?: string;
    length?: number;
    ch?: string;
}

interface ProgramApiModelInterface {
    init(callback: Function): void;
    update(diff?: boolean): void;
    getGenres(): { [key: string]: any }[] | null;
    getSubGenres(): { [key: number]: { [key:number]: string } } | null;
    getTime(): { [key: string]: number } | null;
    getChannel(): { [key: string]: any }[] | null;
    getProgram(): { [key: string]: any }[] | null;
    getUpdateTime(): Date;
    setUpdateTime(): void;
}

/**
* 番組表情報を取得
*/
class ProgramApiModel extends ApiModel implements ProgramApiModelInterface {
    private genres: { [key: string]: any }[] | null = null;
    private subGenres: { [key: number]: { [key:number]: string } } | null = null;
    private time: { [key: string]: number } | null = null;
    private channel: { [key: string]: any }[] | null = null;
    private program: { [key: string]: any }[] | null = null;
    private updateTime: Date = new Date();
    private diffUpdateCallback: Function | null = null;

    /**
    * 初期化
    * @param 差分更新処理の callback 差分更新時に呼ぶ
    */
    public init (callback: Function): void {
        this.genres = null;
        this.subGenres = null;
        this.time = null;
        this.channel = null;
        this.program = null;
        this.updateTime = new Date();
        this.diffUpdateCallback = callback;
    }

    /**
    * 番組表情報を取得
    * @param option ProgramApiOptionInterface
    * @param 差分更新時に指定する ture: 差分更新, false: 通常更新 (default)
    */
    public update(diff: boolean = false): void {
        let option = this.createProgramOption();

        if(diff && typeof option.time == "undefined" && this.time != null) {
            option.time = DateUtil.format(DateUtil.getJaDate(new Date(this.time["startTime"])), "yyyyMMddhh");
        }

        this.getRequest({ method: "GET", url: `/api/program?${ m.buildQueryString(option) }` },
        (value: {}) => {
            this.genres = value["genres"];
            this.subGenres = value["subGenres"];
            this.time = value["time"];
            this.channel = value["channel"];
            this.program = value["program"];
            if(!diff) {
                this.updateTime = new Date();
            } else if(this.diffUpdateCallback != null) {
                //差分更新をする
                this.diffUpdateCallback();
            }
        },
        "ProgramApiModel update error", 40);
    }

    public getGenres(): { [key: string]: any }[] | null {
        return this.genres;
    }

    public getSubGenres(): { [key: number]: { [key:number]: string } } | null {
        return this.subGenres;
    }

    public getTime(): { [key: string]: number } | null {
        return this.time;
    }

    public getChannel(): { [key: string]: any }[] | null {
        return this.channel;
    }

    public getProgram(): { [key: string]: any }[] | null {
        return this.program;
    }

    public getUpdateTime(): Date {
        return this.updateTime;
    }

    public setUpdateTime(): void {
        this.updateTime = new Date();
    }

    //program 取得の option を生成する
    private createProgramOption(): ProgramApiOptionInterface {
        let query = Util.getCopyQuery();
        let option: ProgramApiOptionInterface = {
            type: typeof query["type"] != "undefined" ?  query["type"] : null
        }

        if(typeof query["time"] != "undefined") { option.time = query["time"]; }
        if(typeof query["length"] != "undefined") { option.length = query["length"]; }
        if(typeof query["ch"] != "undefined") { option.ch = query["ch"]; }

        return option;
    }
}

export { ProgramApiOptionInterface, ProgramApiModelInterface, ProgramApiModel };

