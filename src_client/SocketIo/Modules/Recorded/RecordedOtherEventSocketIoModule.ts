"use strict";

import SocketIoModule from '../SocketIoModule';
import { RecordedApiModelInterface } from '../../../Model/Api/Recorded/RecordedApiModel';

/*
* 他の socketio のイベントで RecordedApiModel を更新する
*/
class RecordedOtherEventSocketIoModule extends SocketIoModule {
    private recordedApiModel: RecordedApiModelInterface;

    constructor(_recordedApiModel: RecordedApiModelInterface) {
        super();
        this.recordedApiModel = _recordedApiModel;
    }

    public getName(): string { return "recordedOtherEvent"; }

    public getEventName(): string[] {
        return [
            "programAutorec",
            "programCancelaRec",
            "programCustomRec",
            "programSimpleRec",
            "reservationCancelRec",
            "keywordDelete",
            "keywordEnable",
            "keywordAdd"
        ];
    }

    public execute(_option: { [key: string]: any; }): void {
        this.recordedApiModel.update();
    }
}

export default RecordedOtherEventSocketIoModule;

