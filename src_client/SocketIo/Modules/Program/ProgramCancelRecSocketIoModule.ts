"use strict";

import SocketIoModule from '../SocketIoModule';
import { CancelRecEpgrecModuleModelInterface } from '../../../Model/Api/EpgrecModule/CancelRecEpgrecModuleModel';

/*
* 予約が削除されると呼ばれる
*/
class ProgramCancelRecSocketIoModule extends SocketIoModule {
    private cancelRecEpgrecModuleModel: CancelRecEpgrecModuleModelInterface;

    public getName(): string { return "programCancelaRec"; }

    public getEventName(): string[] {
        return [
            "programCancelaRec"
        ];
    }

    constructor(_cancelRecEpgrecModuleModel: CancelRecEpgrecModuleModelInterface) {
        super();
        this.cancelRecEpgrecModuleModel = _cancelRecEpgrecModuleModel;
    }

    public execute(option: { [key: string]: any; }): void {
        this.cancelRecEpgrecModuleModel.viewUpdate(option);
    }
}

export default ProgramCancelRecSocketIoModule;

