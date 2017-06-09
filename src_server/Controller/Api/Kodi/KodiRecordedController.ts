"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';

class KodiRecordedController extends Controller {
    public execute(parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'KodiRecordedController' was called.");

        let length = parsedUrl.query.length;
        let asc = parsedUrl.query.asc;

        let model = this.modelFactory.get("KodiRecordedModel");
        model.setOption({
            length: Number(length),
            asc: Number(asc)
        });

        let view = new NormalApiView(response, "KodiRecordedModel");
        view.setModels({ KodiRecordedModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default KodiRecordedController;

