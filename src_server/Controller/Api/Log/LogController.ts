"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';

class LogController extends Controller {
    public execute(parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'LogController' was called.");

        let info = parsedUrl.query.info;
        let warning = parsedUrl.query.warning;
        let error = parsedUrl.query.error;
        let debug = parsedUrl.query.debug;

        let model = this.modelFactory.get("LogModel");
        model.setOption({
            info: Number(info),
            warning: Number(warning),
            error: Number(error),
            debug: Number(debug)
        });

        let view = new NormalApiView(response, "LogModel");
        view.setModels({ LogModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default LogController;

