"use strict";

import ApiModel from '../ApiModel';
import EpgrecOperater from '../../../EpgrecOperater/EpgrecOperater'

class ReservationCancelRecModel extends ApiModel {
    private cancelReservationEpgrecOperater: EpgrecOperater;

    constructor(_cancelReservationEpgrecOperater: EpgrecOperater) {
        super();
        this.cancelReservationEpgrecOperater = _cancelReservationEpgrecOperater;
    }

    public execute(): void {
        if(typeof this.option["rec_id"] == "undefined" || typeof this.option["autorec"] == "undefined") {
            this.errors = 415;
            this.eventsNotify();
            return;
        }

        this.cancelReservationEpgrecOperater.execute(this.option, (value) => {
            this.results = {};

            if(value.match(/error/i)) {
                this.results = { status: "error", rec_id: this.option["rec_id"], messeage: value };
            } else {
                this.results = { status: "completed", rec_id: this.option["rec_id"] };
            }

            this.eventsNotify();
        },
        (err) => {
            this.errors = err["code"];
            this.eventsNotify();
        });
    }
}

export default ReservationCancelRecModel;

