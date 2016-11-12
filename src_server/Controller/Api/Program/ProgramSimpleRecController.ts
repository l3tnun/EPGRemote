"use strict";

import * as http from 'http';
import * as url from 'url';
import * as querystring from 'querystring';
import SocketIoServer from '../../../SocketIo/SocketIoServer';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';
import NormalApiSocketIoView from '../../../View/SocketIo/Api/NormalApiSocketIoView';

class ProgramSimpleRecController extends Controller {
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, postData: string): void {
        this.log.access.info("controller 'ProgramSimpleRecController' was called.");
        let query = querystring.parse(postData);

        let model = this.modelFactory.get("ProgramSimpleRecModel");
        model.setOption({ program_id: Number(query["program_id"]) });

        let view = new NormalApiView(response, "ProgramSimpleRecModel");
        view.setModels({ ProgramSimpleRecModel: model });

        let sockets = SocketIoServer.getInstance().getSockets();
        let socketIoView = new NormalApiSocketIoView(sockets, "ProgramSimpleRecModel", "programSimpleRec");
        socketIoView.setModels({ ProgramSimpleRecModel: model });

        model.addViewEvent(view);
        model.addViewEvent(socketIoView);
        model.execute();
    }
}

export default ProgramSimpleRecController;

