"use strict";

import ViewModel from '../ViewModel';
import { CancelReservationEpgrecModuleModelInterface } from '../../Model/Api/EpgrecModule/CancelReservationEpgrecModuleModel';

/**
* Reservation の ViewModel
*/
class ReservationDeleteDialogContentViewModel extends ViewModel {
    private cancelReservationEpgrecModuleModel: CancelReservationEpgrecModuleModelInterface;
    private _program: { [key: string]: any } | null = null;
    public deleteCheckBox: boolean;

    constructor(_cancelReservationEpgrecModuleModel: CancelReservationEpgrecModuleModelInterface) {
        super();

        this.cancelReservationEpgrecModuleModel = _cancelReservationEpgrecModuleModel;
    }

    public setup(_program: { [key: string]: any }): void {
        this._program = _program;

        //checkbox init
        this.deleteCheckBox = false;
    }

    /**
    * 予約削除
    * @param rec_id rec_id
    * @param autorec true: 自動予約禁止, false: 自動予約許可
    */
    public deleteProgram(rec_id: number): void {
        this.cancelReservationEpgrecModuleModel.execute(rec_id, this.deleteCheckBox);
    }

    //getter
    get program(): { [key: string]: any } | null {
        return this._program;
    }
}

namespace ReservationDeleteDialogContentViewModel {
    export const dialogId = "reservation_delete_dialog";
}

export default ReservationDeleteDialogContentViewModel;

