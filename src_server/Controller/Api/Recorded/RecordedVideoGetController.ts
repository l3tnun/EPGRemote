"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';

class RecordedVideoGetController extends Controller {
    public execute(parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'RecordedVideoGetController' was called.");

        let rec_id = parsedUrl.query.rec_id;
        let ios = parsedUrl.query.ios;

        let model = this.modelFactory.get("RecordedVideoPathModel");
        model.setOption({ rec_id: Number(rec_id), ios: Number(ios) });

        let view = new NormalApiView(response, "RecordedVideoPathModel");
        view.setModels({ RecordedVideoPathModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default RecordedVideoGetController;

