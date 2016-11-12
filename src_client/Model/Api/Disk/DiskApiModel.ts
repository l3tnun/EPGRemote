"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';

interface DiskApiModelInterface extends ApiModel {
    update(callback?: Function | null): void;
    getSize(): number;
    getUsed(): number;
    getAvailable(): number;
}

/**
* Disk 情報をサーバから取得する
*/
class DiskApiModel implements DiskApiModelInterface {
    private size: number = 0;
    private used: number = 0;
    private available: number = 0;

    /**
    * server から disk 情報を取得する
    */
    public update(callback: Function | null = null): void {
        m.request({ method: "GET", url: `/api/disk` })
        .then((value) => {
            this.size = value["size"];
            this.used = value["used"];
            this.available = value["available"];

            if(callback == null) { return; }
            callback();
        },
        (error) => {
            console.log("DiskApiModel update error");
            console.log(error);
        });
    }

    /**
    * disk の大きさを返す(GB)
    */
    public getSize(): number {
        return this.size;
    }

    /**
    * disk の使用サイズを返す(GB)
    */
    public getUsed(): number {
        return this.used;
    }

    /**
    * disk の空き容量を返す(GB)
    */
    public getAvailable(): number {
        return this.available;
    }
}

export { DiskApiModelInterface, DiskApiModel };

