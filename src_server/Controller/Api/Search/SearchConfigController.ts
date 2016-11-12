"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';

class SearchConfigController extends Controller {
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'SearchConfigController' was called.");

        let model = this.modelFactory.get("SearchConfigModel");

        let view = new NormalApiView(response, "SearchConfigModel");
        view.setModels({ SearchConfigModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default SearchConfigController;

