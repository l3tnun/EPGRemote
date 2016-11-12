"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';

class ProgramController extends Controller {
    public execute(parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'ProgramController' was called.");

        let type = parsedUrl.query.type;
        let time = parsedUrl.query.time;
        let length = parsedUrl.query["length"];
        let ch = parsedUrl.query.ch;

        let model = this.modelFactory.get("ProgramModel");
        model.setOption({ type: type, time: time, length: Number(length), ch: ch });

        let view = new NormalApiView(response, "ProgramModel");
        view.setModels({ ProgramModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default ProgramController;

