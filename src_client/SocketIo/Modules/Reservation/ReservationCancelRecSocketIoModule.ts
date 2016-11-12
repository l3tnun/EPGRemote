"use strict";

import * as m from 'mithril';
import SocketIoModule from '../SocketIoModule';
import { CancelReservationEpgrecModuleModelInterface } from '../../../Model/Api/EpgrecModule/CancelReservationEpgrecModuleModel';

/*
* 予約が削除されたら呼ばれる
*/
class ReservationCancelRecSocketIoModule extends SocketIoModule {
    private cancelReservationModule: CancelReservationEpgrecModuleModelInterface;

    public getName(): string { return "reservationCancelRec"; }

    public getEventName(): string[] {
        return [
            "reservationCancelRec"
        ];
    }

    constructor(_cancelReservationModule: CancelReservationEpgrecModuleModelInterface) {
        super();
        this.cancelReservationModule = _cancelReservationModule;
    }

    public execute(option: { [key: string]: any; }): void {
        m.startComputation();
        this.cancelReservationModule.viewUpdate(option);
        m.endComputation();
    }
}

export default ReservationCancelRecSocketIoModule;

