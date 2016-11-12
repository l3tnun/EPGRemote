"use strict";

import SocketIoModule from '../SocketIoModule';
import { AutoRecEpgrecModuleModelInterface } from '../../../Model/Api/EpgrecModule/AutoRecEpgrecModuleModel';

/*
* 自動予約の許可、禁止されると呼ばれる
*/
class ProgramAutoRecSocketIoModule extends SocketIoModule {
    private autoRecEpgrecModuleModel: AutoRecEpgrecModuleModelInterface;

    public getName(): string { return "programAutorec"; }

    public getEventName(): string[] {
        return [
            "programAutorec"
        ];
    }

    constructor(_autoRecEpgrecModuleModel: AutoRecEpgrecModuleModelInterface) {
        super();
        this.autoRecEpgrecModuleModel = _autoRecEpgrecModuleModel;
    }

    public execute(option: { [key: string]: any; }): void {
        this.autoRecEpgrecModuleModel.viewUpdate(option);
    }
}

export default ProgramAutoRecSocketIoModule;

