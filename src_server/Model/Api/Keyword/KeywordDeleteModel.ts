"use strict";

import ApiModel from '../ApiModel';
import EpgrecOperater from '../../../EpgrecOperater/EpgrecOperater'

class KeywordDeleteModel extends ApiModel {
    private deleteKeywordEpgrecOperater: EpgrecOperater;

    constructor(_deleteKeywordEpgrecOperater: EpgrecOperater) {
        super();
        this.deleteKeywordEpgrecOperater = _deleteKeywordEpgrecOperater;
    }

    public execute(): void {
        if(typeof this.option["keyword_id"] == "undefined") {
            this.errors = 415;
            this.eventsNotify();
            return;
        }

        this.deleteKeywordEpgrecOperater.execute(this.option, (value) => {
            this.results = {};

            let recv = value.match(/error/i);
            if( recv != null ) {
                this.results = { status: "error", keyword_id: this.option["keyword_id"], messeage: value };
            } else {
                this.results = { status: "completed", keyword_id: this.option["keyword_id"] };
            }

            this.eventsNotify();
        },
        (err) => {
            this.errors = err["code"];
            this.eventsNotify();
        });
    }
}

export default KeywordDeleteModel;

