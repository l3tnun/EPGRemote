"use strict";

import ApiModel from './ApiModel';

interface BroadCastApiModelInterface {
    update(): void;
    getList(): string[];
}

/**
* 有効な放送波を取得する
*/
class BroadCastApiModel extends ApiModel implements BroadCastApiModelInterface {
    private list: string[] = [];

    public update(): void {
        if(this.list.length != 0) { return; }

        this.getRequest({ method: "GET", url: `/api/broadcast` },
        (value: string[]) => {
            this.list = value;
        },
        "BroadCastApiModel update error");
    }

    //取得した有効な放送波を返す
    public getList(): string[] {
        return this.list;
    }
}

export { BroadCastApiModelInterface, BroadCastApiModel };

