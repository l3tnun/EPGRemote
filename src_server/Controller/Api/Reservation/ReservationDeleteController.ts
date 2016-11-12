"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller';
import SocketIoServer from '../../../SocketIo/SocketIoServer';
import NormalApiView from '../../../View/Api/NormalApiView';
import NormalApiSocketIoView from '../../../View/SocketIo/Api/NormalApiSocketIoView';

class ReservationDeleteController extends Controller {
    public execute(parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, _postData: string): void {
        this.log.access.info("controller 'ReservationDeleteController' was called.");

        let rec_id = parsedUrl.query.rec_id;
        let autorec = parsedUrl.query.autorec;

        let model = this.modelFactory.get("ReservationCancelRecModel");
        model.setOption({ rec_id: Number(rec_id), autorec: Number(autorec) });

        let view = new NormalApiView(response, "ReservationCancelRecModel");
        view.setModels({ ReservationCancelRecModel: model });

        let sockets = SocketIoServer.getInstance().getSockets();
        let socketIoView = new NormalApiSocketIoView(sockets, "ReservationCancelRecModel", "reservationCancelRec");
        socketIoView.setModels({ ReservationCancelRecModel: model });

        model.addViewEvent(view);
        model.addViewEvent(socketIoView);
        model.execute();
    }
}

export default ReservationDeleteController;

