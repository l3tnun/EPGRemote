"use strict";

import ApiModel from '../ApiModel';
import EpgrecOperater from '../../../EpgrecOperater/EpgrecOperater'

class ProgramCustomRecModel extends ApiModel {
    private customRecEpgrecOperater: EpgrecOperater;

    constructor(_customRecEpgrecOperater: EpgrecOperater) {
        super();
        this.customRecEpgrecOperater = _customRecEpgrecOperater;
    }

    public execute(): void {
        if(typeof this.option["program_id"] == "undefined") {
            this.errors = 415;
            this.eventsNotify();
            return;
        }

        this.customRecEpgrecOperater.execute(this.option, (value) => {
            this.results = {};

            let recv = value.match(/error/i);
            if( recv != null ) {
                this.results = { status: "error", program_id: this.option["program_id"], messeage: value };
            } else {
                let pt = value.split( ':' );
                let r_id = parseInt(pt[0]);
                //let tuner = pt[1];
                let reload = parseInt(pt[3]);

                if( reload ) {
                    this.results = { status: "reload", program_id: this.option["program_id"] };
                } else if( r_id ){
                    this.results = { status: "completed", program_id: this.option["program_id"] };
                } else {
                    this.results = { status: "error", program_id: this.option["program_id"], messeage: "詳細予約に失敗しました。" };
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

export default ProgramCustomRecModel;

