"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';

class ReservationGetController extends Controller {
    public execute(parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'ReservationGetController' was called.");

        let page = parsedUrl.query.page;
        let limit = parsedUrl.query.limit;

        let model = this.modelFactory.get("ReservationModel");
        model.setOption({ page: Number(page), limit: Number(limit) });

        let view = new NormalApiView(response, "ReservationModel");
        view.setModels({ ReservationModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default ReservationGetController;

