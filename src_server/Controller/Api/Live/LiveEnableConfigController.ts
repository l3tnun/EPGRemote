"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';

class LiveEnableConfigController extends Controller {
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'LiveEnableConfigController' was called.");

        let model = this.modelFactory.get("LiveEnableConfigModel");

        let view = new NormalApiView(response, "LiveEnableConfigModel");
        view.setModels({ LiveEnableConfigModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default LiveEnableConfigController;

