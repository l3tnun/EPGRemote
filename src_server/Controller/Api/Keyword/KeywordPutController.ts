"use strict";

import * as http from 'http';
import * as url from 'url';
import * as querystring from 'querystring';
import Controller from '../../Controller';
import SocketIoServer from '../../../SocketIo/SocketIoServer';
import NormalApiView from '../../../View/Api/NormalApiView';
import NormalApiSocketIoView from '../../../View/SocketIo/Api/NormalApiSocketIoView';

class KeywordPutController extends Controller {
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, postData: string): void {
        this.log.access.info("controller 'KeywordPutController' was called.");

        let query = querystring.parse(postData);
        let keyword_id = query["keyword_id"];
        let status = query["status"];

        let model = this.modelFactory.get("KeywordEnableModel");
        model.setOption({ keyword_id: Number(keyword_id), status: Number(status) });

        let view  = new NormalApiView(response, "KeywordEnableModel");
        view.setModels({ KeywordEnableModel: model });

        let sockets = SocketIoServer.getInstance().getSockets();
        let socketIoView = new NormalApiSocketIoView(sockets, "KeywordEnableModel", "keywordEnable");

        socketIoView.setModels({ KeywordEnableModel: model });
        model.addViewEvent(socketIoView);

        model.addViewEvent(view);
        model.execute();
    }
}

export default KeywordPutController;

