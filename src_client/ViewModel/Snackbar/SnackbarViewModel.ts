"use strict";

import ViewModel from '../ViewModel';
import { SnackbarModelInterface } from '../../Model/Snackbar/SnackbarModel';

/**
* Snackbar ViewModel
*/
class SnackbarViewModel extends ViewModel {
    private model: SnackbarModelInterface;

    constructor(_model: SnackbarModelInterface) {
        super();
        this.model = _model;
    }

    /**
    * snackbar を開く
    * @param message 表示するメッセージを指定する
    */
    public open(message: string): void {
        this.model.open(message);
    }

    /**
    * 表示する文字列を取得
    * 表示するものがなければ null が返される
    */
    public get(): string | null {
        return this.model.get();
    }
}

namespace SnackbarViewModel {
    export const id = "_snackbar";
}

export default SnackbarViewModel;

