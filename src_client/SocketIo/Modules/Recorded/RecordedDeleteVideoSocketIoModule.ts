"use strict";

import SocketIoModule from '../SocketIoModule';
import { DeleteVideoEpgrecModuleModelInterface } from '../../../Model/Api/EpgrecModule/DeleteVideoEpgrecModuleModel';

/*
* ビデオが削除されると呼ばれる
*/
class RecordedDeleteVideoSocketIoModule extends SocketIoModule {
    private deleteVideoEpgrecModule: DeleteVideoEpgrecModuleModelInterface;

    public getName(): string { return "recordedDeleteVideo"; }

    public getEventName(): string[] {
        return [
            "recordedDeleteVideo"
        ];
    }

    constructor(_deleteVideoEpgrecModule: DeleteVideoEpgrecModuleModelInterface) {
        super();
        this.deleteVideoEpgrecModule = _deleteVideoEpgrecModule;
    }

    public execute(option: { [key: string]: any; }): void {
        this.deleteVideoEpgrecModule.viewUpdate(option);
    }
}

export default RecordedDeleteVideoSocketIoModule;

