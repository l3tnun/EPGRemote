"use strict";

import Model from '../Model';
import Util from '../../Util/Util';
import DialogStatus from './DialogStatus';

interface DialogModelInterface extends Model {
    add(id: string): void;
    open(id: string): void;
    close(enableBack?: boolean): void;
    getStatus(id: string): boolean;
    isOpened(): boolean;
}

/**
* Dialog Model
* Dialog の状態を管理する
*/

class DialogModel implements DialogModelInterface {
    private dialogs: { [key: string]: DialogStatus } = {};
    private isPageBack: boolean = false;
    private resizeListener = this.disableBack.bind(this);

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

        if(!Util.isEnableHistory()) { return; }

        //dialog open 時に dummy の履歴を追加
        history.pushState(null, '', document.title);
        this.isPageBack = false;

        //ブラウザのバックで戻った時のイベントを追加
        window.addEventListener('popstate', this.resizeListener);
    }

    /**
    * すべての dialog の状態を close にする
    */
    public close(enableBack: boolean = true): void {
        if(!this.isOpened()) { return; }

        for(let key in this.dialogs) { this.dialogs[key].close(); }

        if(!Util.isEnableHistory()) { return; }

        window.removeEventListener('popstate', this.resizeListener);

        //ブラウザのバックで戻ったか
        if(!this.isPageBack && enableBack) {
            history.back();
            this.isPageBack = false;
        }
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

    /**
    * page back の動作
    */
    private disableBack(): void {
        this.isPageBack = true;
        this.close();
        m.redraw.strategy("diff");
        m.redraw(true);
    }
}

export { DialogModelInterface, DialogModel };

