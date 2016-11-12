"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../../Controller/Controller';
import NormalApiView from '../../../View/Api/NormalApiView'
import Model from '../../../Model/Model'

class DummyNormalApiViewTController extends Controller {
    private model: Model;

    constructor(_model: Model) {
        super();
        this.model = _model;
    }
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, _response: http.ServerResponse, _postData: string): void {
        let view = new NormalApiView(_response, "DummyApiModel");
        view.setModels({ DummyApiModel: this.model });

        this.model.addViewEvent(view);
        this.model.execute();
    }
}

export default DummyNormalApiViewTController;

