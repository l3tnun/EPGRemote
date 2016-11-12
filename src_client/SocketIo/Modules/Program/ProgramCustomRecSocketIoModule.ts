"use strict";

import SocketIoModule from '../SocketIoModule';
import { CustomRecEpgrecModuleModelInterface } from '../../../Model/Api/EpgrecModule/CustomRecEpgrecModuleModel';

/*
* 詳細予約が実行されると呼ばれる
*/
class ProgramCustomRecSocketIoModule extends SocketIoModule {
    private customRecEpgrecModuleModel: CustomRecEpgrecModuleModelInterface;

    public getName(): string { return "programCustomRec"; }

    public getEventName(): string[] {
        return [
            "programCustomRec"
        ];
    }

    constructor(_customRecEpgrecModuleModel: CustomRecEpgrecModuleModelInterface) {
        super();
        this.customRecEpgrecModuleModel = _customRecEpgrecModuleModel;
    }

    public execute(option: { [key: string]: any; }): void {
        this.customRecEpgrecModuleModel.viewUpdate(option);
    }
}

export default ProgramCustomRecSocketIoModule;

