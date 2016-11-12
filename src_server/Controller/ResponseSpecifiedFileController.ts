"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from './Controller';
import ResponseSpecifiedFileView from '../View/ResponseSpecifiedFileView';

class ResponseSpecifiedFileController extends Controller {
    public execute(parsedUrl: url.Url, request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'ResponseSpecifiedFileController' was called.");

        let model = this.modelFactory.get("ResponseSpecifiedFileModel");
        model.setOption({ uri: parsedUrl.pathname });
        let view = new ResponseSpecifiedFileView(response, request, parsedUrl.query.mode);
        view.setModels({ ResponseSpecifiedFileModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default ResponseSpecifiedFileController;

