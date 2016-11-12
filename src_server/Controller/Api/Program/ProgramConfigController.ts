"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';

class ProgramConfigController extends Controller {
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'ProgramConfigController' was called.");

        let model = this.modelFactory.get("ProgramConfigModel");

        let view = new NormalApiView(response, "ProgramConfigModel");
        view.setModels({ ProgramConfigModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default ProgramConfigController;

