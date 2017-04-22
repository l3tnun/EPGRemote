"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';

interface SearchConfigApiModelInterface extends ApiModel {
    update(callback?: Function | null): void;
    getGenres(): { [key: string]: any }[];
    getChannel(): { [key: string]: any }[];
    getSubGenres(): { [key: number]: { [key:number]: string } };
    getRecMode(): { [key: string]: any }[];
    getStartTranscodeId(): number | null;
    getRecModeDefaultId(): number | null;
    getBroadcast(): { [key: string]: boolean; };
}

/**
* search の設定を取得する
*/
class SearchConfigApiModel implements SearchConfigApiModelInterface {
    private genres: { [key: string]: any }[] = [];
    private channel: { [key: string]: any }[] = [];
    private subGenres: { [key: number]: { [key:number]: string } } = {};
    private recMode: { [key: string]: any }[] = [];
    private startTranscodeId: number | null = null;
    private recModeDefaultId: number | null = null;
    private broadcast: { [key: string]: boolean; } = {};

    public update(callback: Function | null = null): void {
        //search config を取得
        m.request({method: "GET", url: "/api/search/config" })
        .then((value) => {
            this.genres = [];
            this.channel = [];
            this.subGenres = {};
            this.recMode = [];
            this.startTranscodeId = null;
            this.recModeDefaultId = null;
            this.broadcast = {};

            this.genres = value["genres"];
            this.subGenres = value["subGenres"];
            this.recMode = value["recMode"];
            this.startTranscodeId = value["startTranscodeId"];
            this.recModeDefaultId = value["recModeDefaultId"];
            this.broadcast = value["broadcast"];
            this.channel = value["channel"];

            if(typeof this.startTranscodeId == "undefined") {
                this.startTranscodeId = null;
            }

            if(callback != null) { callback(); }
        },
        (error) => {
            console.log("SearchConfigApiModel update error");
            console.log(error);
        });
    }

    //ジャンルを返す
    public getGenres(): { [key: string]: any }[] {
        return this.genres;
    }

    //channel を返す
    public getChannel(): { [key: string]: any }[] {
        return this.channel;
    }

    //サブジャンルを返す
    public getSubGenres(): { [key: number]: { [key:number]: string } } {
        return this.subGenres;
    }

    //recMode を返す
    public getRecMode(): { [key: string]: any }[] {
        return this.recMode;
    }

    //startTranscodeId を返す
    public getStartTranscodeId(): number | null {
        return this.startTranscodeId;
    }

    //recModeDefaultId を返す
    public getRecModeDefaultId(): number | null {
        return this.recModeDefaultId;
    }

    //broadcast を返す
    public getBroadcast(): { [key: string]: boolean; } {
        return this.broadcast;
    }
}

export { SearchConfigApiModelInterface, SearchConfigApiModel };

