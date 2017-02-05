"use strict";

import * as m from 'mithril';
import SocketIoModule from '../SocketIoModule';
import { ReservationApiModelInterface } from '../../../Model/Api/Reservation/ReservationApiModel';

/*
* 他の socketio のイベントで ReservationApiModel を更新する
*/
class ReservationOtherEventSocketIoModule extends SocketIoModule {
    private reservationApiModel: ReservationApiModelInterface;

    public getName(): string { return "reservationOtherEvent"; }

    public getEventName(): string[] {
        return [
            "programAutorec",
            "programCancelaRec",
            "programCustomRec",
            "programSimpleRec",
            "recordedDeleteVideo",
            "keywordDelete",
            "keywordEnable",
            "keywordAdd"
        ];
    }

    constructor(_reservationApiModel: ReservationApiModelInterface) {
        super();
        this.reservationApiModel = _reservationApiModel;
    }

    public execute(_option: { [key: string]: any; }): void {
        this.reservationApiModel.update();
    }
}

export default ReservationOtherEventSocketIoModule;

