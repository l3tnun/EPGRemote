"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';

class DiskController extends Controller {
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'DiskController' was called.");

        let model = this.modelFactory.get("DiskModel");

        let view = new NormalApiView(response, "DiskModel");
        view.setModels({ DiskModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default DiskController;

