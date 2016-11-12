"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';

class RecordedChannelListController extends Controller {
    public execute(parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'RecordedChannelListController' was called.");

        let search = parsedUrl.query.search;
        let autorec = parsedUrl.query.keyword_id;
        let category_id = parsedUrl.query.category_id;
        let channel_id = parsedUrl.query.channel_id;

        let model = this.modelFactory.get("RecordedChannelListModel");
        model.setOption({
            search: search,
            autorec: Number(autorec),
            category_id: Number(category_id),
            channel_id: Number(channel_id),
        });

        let view = new NormalApiView(response, "RecordedChannelListModel");
        view.setModels({ RecordedChannelListModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default RecordedChannelListController;

