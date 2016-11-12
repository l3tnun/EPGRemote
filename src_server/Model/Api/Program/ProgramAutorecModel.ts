"use strict";

import ApiModel from '../ApiModel';
import EpgrecOperater from '../../../EpgrecOperater/EpgrecOperater'

class ProgramModel extends ApiModel {
    private autorecEpgrecOperater: EpgrecOperater;

    constructor(_autorecEpgrecOperater: EpgrecOperater) {
        super();
        this.autorecEpgrecOperater = _autorecEpgrecOperater;
    }

    public execute(): void {
        if(this.checkNull(this.option["program_id"]) || this.checkNull(this.option["autorec"])) {
            this.errors = 415;
            this.eventsNotify();
            return;
        }

        this.autorecEpgrecOperater.execute(this.option, () => {
            this.results = { status: "completed", program_id: this.option["program_id"], autorec: this.option["autorec"] };
            this.eventsNotify();
        },
        (err) => {
            this.errors = err["code"];
            this.eventsNotify();
        });
    }
}

export default ProgramModel;

