"use strict";

import * as http from 'http';
import * as url from 'url';
import * as querystring from 'querystring';
import SocketIoServer from '../../../SocketIo/SocketIoServer';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';
import NormalApiSocketIoView from '../../../View/SocketIo/Api/NormalApiSocketIoView';

class ProgramCustomRecController extends Controller {
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, postData: string): void {
        this.log.access.info("controller 'ProgramCustomRecController' was called.");
        let query = querystring.parse(postData);

        let model = this.modelFactory.get("ProgramCustomRecModel");
        model.setOption({
            program_id:     Number(query["program_id"]),
            syear:          Number(query["syear"]),
            smonth:         Number(query["smonth"]),
            sday:           Number(query["sday"]),
            shour:          Number(query["shour"]),
            smin:           Number(query["smin"]),
            ssec:           Number(query["ssec"]),
            eyear:          Number(query["eyear"]),
            emonth:         Number(query["emonth"]),
            eday:           Number(query["eday"]),
            ehour:          Number(query["ehour"]),
            emin:           Number(query["emin"]),
            esec:           Number(query["esec"]),
            channel_id:     Number(query["channel_id"]),
            record_mode:    Number(query["record_mode"]),
            title:          query["title"],
            description:    query["description"],
            category_id:    Number(query["category_id"]),
            discontinuity:  Number(query["discontinuity"]),
            priority:       Number(query["priority"]),
            ts_del:         Number(query["ts_del"])
        });

        let view = new NormalApiView(response, "ProgramCustomRecModel");
        view.setModels({ ProgramCustomRecModel: model });

        let sockets = SocketIoServer.getInstance().getSockets();
        let socketIoView = new NormalApiSocketIoView(sockets, "ProgramCustomRecModel", "programCustomRec");
        socketIoView.setModels({ ProgramCustomRecModel: model });

        model.addViewEvent(view);
        model.addViewEvent(socketIoView);
        model.execute();
    }
}

export default ProgramCustomRecController;

