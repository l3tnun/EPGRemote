"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';

class LiveHttpConfigController extends Controller {
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'LiveHttpConfigController' was called.");

        let model = this.modelFactory.get("LiveHttpConfigModel");

        let view = new NormalApiView(response, "LiveHttpConfigModel");
        view.setModels({ LiveHttpConfigModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default LiveHttpConfigController;

