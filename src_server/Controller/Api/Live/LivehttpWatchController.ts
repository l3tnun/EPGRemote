"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import LiveHttpWatchView from '../../../View/Api/Live/LiveHttpWatchView';

class LivehttpWatchController extends Controller {
    public execute(parsedUrl: url.Url, request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'LivehttpWatchController' was called.");

        let model = this.modelFactory.get("LiveHttpWatchModel");
        model.setOption({
            channel: parsedUrl.query.channel,
            sid: parsedUrl.query.sid,
            tunerId: Number(parsedUrl.query.tuner),
            videoId: Number(parsedUrl.query.video),
            pc: Number(parsedUrl.query.pc)
        });

        let view = new LiveHttpWatchView(response, request);
        view.setModels({ LiveHttpWatchModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default LivehttpWatchController;

