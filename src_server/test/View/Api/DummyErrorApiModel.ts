"use strict";

import ApiModel from '../../../Model/Api/ApiModel';

class DummyErrorApiModel extends ApiModel {
    constructor(_errors: number) {
        super();
        this.errors = _errors;
    }

    public execute(): void {
        this.results = {
            dummy: "dummy"
        };

        this.eventsNotify();
    }
}

export default DummyErrorApiModel;

