"use strict";

import * as m from 'mithril';
import SocketIoModule from '../SocketIoModule';
import { ProgramApiModelInterface } from '../../../Model/Api/Program/ProgramApiModel';

/*
* 他の socketio のイベントで ProgramApiModel を更新する
*/
class ProgramOtherEventSocketIoModule extends SocketIoModule {
    private programApiModel: ProgramApiModelInterface;

    constructor(_programApiModel: ProgramApiModelInterface) {
        super();
        this.programApiModel = _programApiModel;
    }

    public getName(): string { return "programOtherEvent"; }

    public getEventName(): string[] {
        return [
            "recordedDeleteVideo",
            "reservationCancelRec",
            "keywordDelete",
            "keywordEnable",
            "keywordAdd"
        ];
    }

    public execute(_option: { [key: string]: any; }): void {
        m.startComputation();
        this.programApiModel.update(true);
        m.endComputation();
    }
}

export default ProgramOtherEventSocketIoModule;

