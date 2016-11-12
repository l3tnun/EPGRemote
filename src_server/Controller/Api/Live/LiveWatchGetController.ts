"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';

class LiveWatchGetController extends Controller {
    public execute(parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'LiveWatchGetController' was called.");

        let model = this.modelFactory.get("LiveWatchStreamInfoModel");
        let streamId = parsedUrl.query.stream;
        if(typeof streamId != "undefined") { model.setOption({ streamId: Number(streamId) }); }

        let view = new NormalApiView(response, "LiveWatchStreamInfoModel");
        view.setModels({ LiveWatchStreamInfoModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default LiveWatchGetController;

