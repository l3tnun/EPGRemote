"use strict";

import Model from '../Model';
import DialogStatus from './DialogStatus';

interface DialogModelInterface extends Model {
    add(id: string): void;
    open(id: string): void;
    close(): void;
    getStatus(id: string): boolean;
    isOpened(): boolean;
}

/**
* Dialog Model
* Dialog の状態を管理する
*/

class DialogModel implements DialogModelInterface {
    private dialogs: { [key: string]: DialogStatus } = {};

    /**
    * 管理するダイアログを追加する
    * @param id dialog id
    */
    public add(id: string): void {
        if(typeof this.dialogs[id] == "undefined") {
            this.dialogs[id] = new DialogStatus;
        }
    }

    /**
    * 指定した id のダイアログを open にする
    * @param id dialog id
    * @throw DialogModelOpenError 指定された id の dialog が無かった場合に発生
    */
    public open(id: string): void {
        if(typeof this.dialogs[id] == "undefined") {
            throw new Error("DialogModelOpenError");
        }

        this.dialogs[id].open();
    }

    /**
    * すべての dialog の状態を close にする
    */
    public close(): void {
        for(let key in this.dialogs) { this.dialogs[key].close(); }
    }

    /**
    * 指定した id のダイアログの状態を返す
    * @param id dialog の id
    * @throw DialogModelGetStatusError 指定された id の dialog が無かった場合に発生
    */
    public getStatus(id: string): boolean {
        if(typeof this.dialogs[id] == "undefined") {
            throw new Error("DialogModelGetStatusError");
        }

        return this.dialogs[id].getStatus();
    }

    /**
    * ダイアログが開かれているか
    * true: opened, false: closed
    */
    public isOpened(): boolean {
        for(let key in this.dialogs) {
            if(this.getStatus(key)) { return true; }
        }

        return false;
    }
}

export { DialogModelInterface, DialogModel };

