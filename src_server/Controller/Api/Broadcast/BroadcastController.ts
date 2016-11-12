"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';

class BroadcastController extends Controller {
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'BroadcastController' was called.");

        let model = this.modelFactory.get("BroadcastModel");

        let view = new NormalApiView(response, "BroadcastModel");
        view.setModels({ BroadcastModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default BroadcastController;

