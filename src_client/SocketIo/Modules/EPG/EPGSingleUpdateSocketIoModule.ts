"use strict";

import SocketIoModule from '../SocketIoModule';
import { EPGSingleUpdateEpgrecModuleModelInterface } from '../../../Model/Api/EpgrecModule/EPGSingleUpdateEpgrecModuleModel';

/*
* EPG 単局更新が実行されたら呼ばれる
*/
class EPGSingleUpdateSocketIoModule extends SocketIoModule {
    private epgSingleUpdateEpgrecModuleModel: EPGSingleUpdateEpgrecModuleModelInterface;

    public getName(): string { return "epgSingleUpdate"; }

    public getEventName(): string[] {
        return [
            "epgSingleUpdate"
        ];
    }

    constructor(_epgSingleUpdateEpgrecModuleModel: EPGSingleUpdateEpgrecModuleModelInterface) {
        super();
        this.epgSingleUpdateEpgrecModuleModel = _epgSingleUpdateEpgrecModuleModel;
    }

    public execute(option: { [key: string]: any; }): void {
        this.epgSingleUpdateEpgrecModuleModel.viewUpdate(option);
    }
}

export default EPGSingleUpdateSocketIoModule;

