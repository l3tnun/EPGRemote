"use strict";

import ApiModel from '../../../Model/Api/ApiModel';

class DummyApiModel extends ApiModel {
    private callback: (option: { [key: string]: any }) => void;

    constructor(_callback: (option: { [key: string]: any }) => void) {
        super();
        this.callback = _callback;
    }

    public execute(): void {
        //model に渡される option をチェックする
        this.callback(this.option);

        this.results = {};

        this.eventsNotify();
    }
}

export default DummyApiModel;

