"use strict";

import * as http from 'http';
import * as url from 'url';
import SocketIoServer from '../../../SocketIo/SocketIoServer';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';
import NormalApiSocketIoView from '../../../View/SocketIo/Api/NormalApiSocketIoView';

class RecordedVideoDeleteController extends Controller {
    public execute(parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'RecordedVideoDeleteController' was called.");

        let rec_id = parsedUrl.query.rec_id;
        let delete_file = parsedUrl.query.delete_file;
        let model = this.modelFactory.get("RecordedDeleteVideoModel");
        model.setOption({ rec_id: Number(rec_id), delete_file: Number(delete_file) });

        let view = new NormalApiView(response, "RecordedDeleteVideoModel");
        view.setModels({ RecordedDeleteVideoModel: model });

        let sockets = SocketIoServer.getInstance().getSockets();
        let socketIoView = new NormalApiSocketIoView(sockets, "RecordedDeleteVideoModel", "recordedDeleteVideo");
        socketIoView.setModels({ RecordedDeleteVideoModel: model });
        model.addViewEvent(socketIoView);

        model.addViewEvent(view);
        model.execute();
    }
}

export default RecordedVideoDeleteController;

