"use strict";

import ApiModel from '../ApiModel';
import EpgrecOperater from '../../../EpgrecOperater/EpgrecOperater'

class EPGSingleUpdateModel extends ApiModel {
    private epgSingleUpdateEpgrecOperater: EpgrecOperater;

    constructor(_epgSingleUpdateEpgrecOperater: EpgrecOperater) {
        super();
        this.epgSingleUpdateEpgrecOperater = _epgSingleUpdateEpgrecOperater;
    }

    public execute(): void {
        if(typeof this.option["channel_disc"] == "undefined") {
            this.errors = 415;
            this.eventsNotify();
            return;
        }

        this.epgSingleUpdateEpgrecOperater.execute(this.option, (value) => {
            let recv = value.match(/error/i);

            if( recv != null ) {
                this.results = { status: "completed", channel_disc: this.option["channel_disc"] };
            } else {
                 this.results = { status: "error", channel_disc: this.option["channel_disc"], messeage: value };
            }
            this.eventsNotify();
        },
        (err) => {
            this.errors = err["code"];
            this.eventsNotify();
        },
        () => {
            this.results = { status: "completed", channel_disc: this.option["channel_disc"] };
            this.eventsNotify();
        });
    }
}

export default EPGSingleUpdateModel;

