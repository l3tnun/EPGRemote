"use strict";

import ViewModel from '../ViewModel';
import { LogPageApiModelInterface } from '../../Model/Api/LogPage/LogPageApiModel';

/**
* LogPage の ViewModel
*/
class LogPageViewModel extends ViewModel {
    private logPageApiModel: LogPageApiModelInterface;
    private _info: boolean = true;
    private _warning: boolean = true;
    private _error: boolean = true;
    private _debug: boolean = false;

    constructor(_logPageApiModel: LogPageApiModelInterface) {
        super();

        this.logPageApiModel = _logPageApiModel;
    }

    /**
    * 初期化
    * controller からページ読み込み時に呼ばれる
    */
    public init(): void {
        this._info = true;
        this._warning = true;
        this._error = true;
        this._debug = false;
        this.update();
    }

    //更新
    public update(): void {
        this.logPageApiModel.update(
            this._info,
            this._warning,
            this._error,
            this._debug );
    }

    //log を返す
    public getLogList(): any[] {
        return this.logPageApiModel.getLogList();
    }

    //info getter setter
    get info(): boolean { return this._info; }
    set info(value: boolean) { this._info = value; }

    //warning getter setter
    get warning(): boolean { return this._warning; }
    set warning(value: boolean) { this._warning = value; }

    //error getter setter
    get error(): boolean { return this._error; }
    set error(value: boolean) { this._error = value; }

    //debug getter setter
    get debug(): boolean { return this._debug; }
    set debug(value: boolean) { this._debug = value; }
}

export default LogPageViewModel;

