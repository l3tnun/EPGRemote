"use strict";

import * as m from 'mithril';
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
        m.startComputation();
        this.deleteVideoEpgrecModule.viewUpdate(option);
        m.endComputation();
    }
}

export default RecordedDeleteVideoSocketIoModule;

