"use strict";

import * as http from 'http';
import * as url from 'url';
import * as querystring from 'querystring';
import SocketIoServer from '../../../SocketIo/SocketIoServer';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';
import NormalApiSocketIoView from '../../../View/SocketIo/Api/NormalApiSocketIoView';

class ProgramAutorecController extends Controller {
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, postData: string): void {
        this.log.access.info("controller 'ProgramAutorecController' was called.");
        let query = querystring.parse(postData);

        let model = this.modelFactory.get("ProgramAutorecModel");
        model.setOption({ program_id: Number(query["program_id"]), autorec: Number(query["autorec"]) });

        let view = new NormalApiView(response, "ProgramAutorecModel");
        view.setModels({ ProgramAutorecModel: model });

        let sockets = SocketIoServer.getInstance().getSockets();
        let socketIoView = new NormalApiSocketIoView(sockets, "ProgramAutorecModel", "programAutorec");
        socketIoView.setModels({ ProgramAutorecModel: model });

        model.addViewEvent(view);
        model.addViewEvent(socketIoView);
        model.execute();
    }
}

export default ProgramAutorecController;

