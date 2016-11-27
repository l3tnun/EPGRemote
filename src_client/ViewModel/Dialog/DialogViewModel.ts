"use strict";

import ViewModel from '../ViewModel';
import Util from '../../Util/Util';
import { DialogModelInterface } from '../../Model/Dialog/DialogModel';

/**
* Dialog の ViewModel
* @throw DialogViewModelOpenError 指定された id の dialog が無かった場合に発生
* @throw DialogViewModelGetStatusError 指定された id の dialog が無かった場合に発生
*/
class DialogViewModel extends ViewModel {
    private model: DialogModelInterface;
    private isPageBack: boolean = false;
    private resizeListener = this.disableBack.bind(this);

    constructor(_model: DialogModelInterface) {
        super();
        this.model = _model;
    }

    /**
    * 初期化
    */
    public init(): void {
        this.model.close();
    }

    /**
    * 管理するダイアログを追加する
    * @param id dialogを一意に特定するための id
    */
    public add(id: string): void {
        this.model.add(id);
    }

    /**
    * 指定した id のダイアログの状態を open にする
    * @param id dialog の id
    * @throw DialogModelOpenError 指定された id の dialog が無かった場合に発生
    */
    public open(id: string): void {
        this.model.open(id);

        if(!Util.isEnableHistory()) { return; }

        //dialog open 時に dummy の履歴を追加
        history.pushState(null, '', '');
        this.isPageBack = false;

        //ブラウザのバックで戻った時のイベントを追加
        window.addEventListener('popstate', this.resizeListener);
    }

    //すべての dialog の状態を close にする
    public close(enableBack: boolean = true): void {
        if(!this.model.isOpened()) { return; }

        this.model.close();

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
        return this.model.getStatus(id);
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

export default DialogViewModel;

