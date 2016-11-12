"use strict";

import ViewModel from './ViewModel/ViewModel';

/**
* Model を外部から注入、取り出すクラス
* Controller, View で使用される
* @throw MithrilBaseGetModelError getModel で指定した ViewModel が無かった時に発生する
*/
abstract class MithrilBase {
    protected options: { [key: string]: any } = {};
    private viewModels: { [key: string]: ViewModel } = {};

    public setOptions(options: { [key: string]: any }): void {
        this.options = options;
        this.checkOptions();
    }

    protected checkOptions(): void {};

    /**
    * this.options の型チェック
    * @param optionName option name
    * @param type type
    * @return true: パラメータで指定した通り false: パラメータの指定とは違う
    */
    protected typeCheck(optionName: string, type: string): boolean {
        return(typeof this.options[optionName] != "undefined" && typeof this.options[optionName] == type);
    }

    public setModels(models: { [key: string]: ViewModel } | null): void {
        this.viewModels = (models == null) ? {} : models;
    }

    public getModel(name: string): ViewModel {
        if(typeof this.viewModels[name] == "undefined") {
            console.log(`${ name } is not found in viewModels`);
            throw new Error("MithrilBaseGetModelError");
        }
        return this.viewModels[name];
    }
}

export default MithrilBase;

