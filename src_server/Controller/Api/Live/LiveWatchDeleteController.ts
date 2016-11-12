"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';

class LiveWatchDeleteController extends Controller {
    public execute(parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'LiveWatchDeleteController' was called.");

        let model = this.modelFactory.get("LiveWatchStopStreamModel");
        model.setOption({ streamId: Number(parsedUrl.query.stream) });
        let view = new NormalApiView(response, "LiveWatchStopStreamModel");
        view.setModels({ LiveWatchStopStreamModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default LiveWatchDeleteController;

