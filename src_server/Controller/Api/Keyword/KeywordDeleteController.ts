"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import SocketIoServer from '../../../SocketIo/SocketIoServer';
import NormalApiView from '../../../View/Api/NormalApiView';
import NormalApiSocketIoView from '../../../View/SocketIo/Api/NormalApiSocketIoView';

class KeywordDeleteController extends Controller {
    public execute(parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'KeywordDeleteController' was called.");

        let keyword_id = parsedUrl.query.keyword_id;

        let model = this.modelFactory.get("KeywordDeleteModel");
        model.setOption({ keyword_id: Number(keyword_id) });

        let view = new NormalApiView(response, "KeywordDeleteModel");
        view.setModels({ KeywordDeleteModel: model });

        let sockets = SocketIoServer.getInstance().getSockets();
        let socketIoView = new NormalApiSocketIoView(sockets, "KeywordDeleteModel", "keywordDelete");

        socketIoView.setModels({ KeywordDeleteModel: model });
        model.addViewEvent(socketIoView);

        model.addViewEvent(view);
        model.execute();
    }
}

export default KeywordDeleteController;

