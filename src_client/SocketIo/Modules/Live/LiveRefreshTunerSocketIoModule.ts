"use strict";

import SocketIoModule from '../SocketIoModule';
import {LiveConfigApiModelInterface} from '../../../Model/Api/Live/LiveConfigApiModel';

/*
* tuner 情報がサーバで更新されると呼ばれる
* LiveConfigApiModel を更新する
*/
class LiveRefreshTunerSocketIoModule extends SocketIoModule {
    private liveConfigApiModel: LiveConfigApiModelInterface;

    constructor(_liveConfigApiModel: LiveConfigApiModelInterface) {
        super();
        this.liveConfigApiModel = _liveConfigApiModel;
    }

    public getName(): string { return "refreshTuner"; }

    public getEventName(): string[] {
        return [
            "refreshTuner"
        ];
    }

    public execute(_option: { [key: string]: any; }): void {
        this.liveConfigApiModel.update();
    }
}

export default LiveRefreshTunerSocketIoModule;

