"use strict";

import ViewModel from '../ViewModel';
import { DialogModelInterface } from '../../Model/Dialog/DialogModel';

/**
* Dialog の ViewModel
* @throw DialogViewModelOpenError 指定された id の dialog が無かった場合に発生
* @throw DialogViewModelGetStatusError 指定された id の dialog が無かった場合に発生
*/
class DialogViewModel extends ViewModel {
    private model: DialogModelInterface;

    constructor(_model: DialogModelInterface) {
        super();
        this.model = _model;
    }

    /**
    * 初期化
    */
    public init(): void {
        this.model.close(false);
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
    }

    //すべての dialog の状態を close にする
    public close(enableBack: boolean = true): void {
        this.model.close(enableBack);
    }

    /**
    * 指定した id のダイアログの状態を返す
    * @param id dialog の id
    * @throw DialogModelGetStatusError 指定された id の dialog が無かった場合に発生
    */
    public getStatus(id: string): boolean {
        return this.model.getStatus(id);
    }
}

export default DialogViewModel;

