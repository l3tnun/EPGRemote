"use strict";

import * as http from 'http';
import ApiView from './ApiView';

class NormalApiView extends ApiView {
    private modelName: string;

    constructor (_response: http.ServerResponse, _modelName: string) {
        super(_response);
        this.modelName = _modelName;
    }

    public execute(): void {
        this.log.access.info("view 'NormalApiViewApiView' was called.");

        let model = this.getModel(this.modelName);
        let errors = model.getErrors();
        if(errors != null) {
            if(errors == 415) {
                this.resposeFormatError();
            } else {
                this.responseServerError();
            }
            return;
        }

        this.responseJson(model.getResults());
    }
}

export default NormalApiView;

