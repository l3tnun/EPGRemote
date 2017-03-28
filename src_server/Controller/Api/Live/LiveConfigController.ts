"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';

class LiveConfigController extends Controller {
    public execute(parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'LiveConfigController' was called.");

        let type = parsedUrl.query.type;
        let method = parsedUrl.query.method;

        let model = this.modelFactory.get("LiveConfigModel");
        model.setOption({
            type: type,
            method: method
        });

        let view = new NormalApiView(response, "LiveConfigModel");
        view.setModels({ LiveConfigModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default LiveConfigController;

