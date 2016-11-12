"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import SocketIoServer from '../../../SocketIo/SocketIoServer';
import NormalApiView from '../../../View/Api/NormalApiView';
import NormalApiSocketIoView from '../../../View/SocketIo/Api/NormalApiSocketIoView';

class ProgramCancelRecController extends Controller {
    public execute(parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'ProgramCancelRecController' was called.");

        let model = this.modelFactory.get("ProgramCancelRecModel");
        model.setOption({ program_id: Number(parsedUrl.query.program_id) });

        let view = new NormalApiView(response, "ProgramCancelRecModel");
        view.setModels({ ProgramCancelRecModel: model });

        let sockets = SocketIoServer.getInstance().getSockets();
        let socketIoView = new NormalApiSocketIoView(sockets, "ProgramCancelRecModel", "programCancelaRec");
        socketIoView.setModels({ ProgramCancelRecModel: model });

        model.addViewEvent(view);
        model.addViewEvent(socketIoView);
        model.execute();
    }
}

export default ProgramCancelRecController;

