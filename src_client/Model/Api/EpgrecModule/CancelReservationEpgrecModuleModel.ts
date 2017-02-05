"use strict";

import * as m from 'mithril';
import EpgrecModuleModel from './EpgrecModuleModel';
import { ReservationApiModelInterface } from '../Reservation/ReservationApiModel';

interface CancelReservationEpgrecModuleModelInterface extends EpgrecModuleModel {
    execute(rec_id: number, autorec: boolean): void;
    viewUpdate(value: { [key: string]: any; }): void;
}

/**
* epgrec の予約削除操作を行う
*/
class CancelReservationEpgrecModuleModel extends EpgrecModuleModel implements CancelReservationEpgrecModuleModelInterface {
    private reservationApiModel: ReservationApiModelInterface;

    constructor(_reservationApiModel: ReservationApiModelInterface) {
        super();
        this.reservationApiModel = _reservationApiModel;
    }

    /**
    * 予約削除
    * @param rec_id rec_id
    * @param autorec true: 自動予約禁止, false: 自動予約許可
    */
    public execute(rec_id: number, autorec: boolean): void {
        let query = {
            rec_id: rec_id,
            autorec: autorec ? 1 : 0
        };

        m.request({
            method: "DELETE",
            url: `/api/reservation?${ m.buildQueryString(query) }`
        })
        .then((_value) => {
            //this.viewUpdate(_value);
        },
        (error) => {
            console.log("CancelReservationEpgrecModuleModel error.");
            console.log(error);
        });
    }

    public viewUpdate(value: { [key: string]: any; }): void {
        super.viewUpdate(value);
        let rec_id = value["rec_id"];
        let program: { [key: string]: any } | null  = null;

        this.reservationApiModel.getPrograms().map((data: { [key: string]: any }) => {
            if(data["id"] == rec_id) { program = data; }
        });
        if(program == null) { return; }

        let snackbarStr = "";
        if(value["status"] == "error") {
            snackbarStr = "予約削除失敗 " + value["messeage"] + " " + program["title"];
        } else {
            snackbarStr = "予約削除 " + program["title"];
            this.reservationApiModel.update();
        }

        this.dialog.close();
        this.snackbar.open(snackbarStr);
    }
}

export { CancelReservationEpgrecModuleModel, CancelReservationEpgrecModuleModelInterface };

