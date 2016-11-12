"use strict";

import ApiModel from '../../../../Model/Api/ApiModel';

class DummyApiModel extends ApiModel {
    public execute(): void {
        this.results = {
            dummy: "dummy"
        };

        this.eventsNotify();
    }
}

export default DummyApiModel;

