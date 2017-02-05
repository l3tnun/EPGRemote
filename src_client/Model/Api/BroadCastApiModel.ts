"use strict";

import * as m from 'mithril';
import ApiModel from './ApiModel';

interface BroadCastApiModelInterface extends ApiModel {
    update(): void;
    getList(): string[];
}

/**
* 有効な放送波を取得する
*/
class BroadCastApiModel implements BroadCastApiModelInterface {
    private list: string[] = [];

    public update(): void {
        if(this.list.length != 0) { return; }

        m.request({method: "GET", url: `/api/broadcast`})
        .then(
            (value: string[]) => {
                this.list = value;
            },
            (error) => {
                console.log('BroadCastApiModel update error');
                console.log(error);
            }
        );
    }

    //取得した有効な放送波を返す
    public getList(): string[] {
        return this.list;
    }
}

export { BroadCastApiModelInterface, BroadCastApiModel };

