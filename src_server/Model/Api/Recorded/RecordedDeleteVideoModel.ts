"use strict";

import ApiModel from '../ApiModel';
import EpgrecOperater from '../../../EpgrecOperater/EpgrecOperater';

class RecordedDeleteVideoModel extends ApiModel {
    private deleteVideoEpgrecOperater: EpgrecOperater;

    constructor(_deleteVideoEpgrecOperater: EpgrecOperater) {
        super();
        this.deleteVideoEpgrecOperater = _deleteVideoEpgrecOperater;
    }

    public execute(): void {
        if(typeof this.option["rec_id"] == "undefined" || typeof this.option["delete_file"] == "undefined") {
            this.errors = 415;
            this.eventsNotify();
            return;
        }

        this.deleteVideoEpgrecOperater.execute(this.option, (value) => {
            this.results = {};

            if(value.match(/^error/i)) {
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

export default RecordedDeleteVideoModel;

