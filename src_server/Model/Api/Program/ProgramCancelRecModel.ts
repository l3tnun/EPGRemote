"use strict";

import ApiModel from '../ApiModel';
import EpgrecOperater from '../../../EpgrecOperater/EpgrecOperater'

class ProgramCancelRecModel extends ApiModel {
    private cancelRecEpgrecOperater: EpgrecOperater;

    constructor(_cancelRecEpgrecOperater: EpgrecOperater) {
        super();
        this.cancelRecEpgrecOperater = _cancelRecEpgrecOperater;
    }

    public execute(): void {
        if(typeof this.option["program_id"] == "undefined") {
            this.errors = 415;
            this.eventsNotify();
            return;
        }

        this.cancelRecEpgrecOperater.execute(this.option, (value) => {
            this.results = {};

            let recv = value.match(/error/i);
            if( recv != null ) {
                this.results = { status: "error", program_id: this.option["program_id"], messeage: value };
            } else {
                let reload = parseInt(value);

                if( reload ) {
                    this.results = { status: "reload", program_id: this.option["program_id"] };
                } else {
                    this.results = { status: "completed", program_id: this.option["program_id"] };
                }
            }

            this.eventsNotify();
        },
        (err) => {
            this.errors = err["code"];
            this.eventsNotify();
        });
    }
}

export default ProgramCancelRecModel;

