"use strict";

import * as http from 'http';
import * as url from 'url';
import * as querystring from 'querystring';
import Controller from '../../Controller';
import SocketIoServer from '../../../SocketIo/SocketIoServer';
import NormalApiView from '../../../View/Api/NormalApiView';
import NormalApiSocketIoView from '../../../View/SocketIo/Api/NormalApiSocketIoView';

class KeywordPostController extends Controller {
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, postData: string): void {
        this.log.access.info("controller 'KeywordPostController' was called.");

        let query = querystring.parse(postData);
        let option = {
            keyword_id:         Number(query.keyword_id),
            keyword:            query.keyword,
            use_regexp:         Number(query.use_regexp),
            collate_ci:         Number(query.collate_ci),
            ena_title:          Number(query.ena_title),
            ena_desc:           Number(query.ena_desc),
            typeGR:             Number(query.typeGR),
            typeBS:             Number(query.typeBS),
            typeCS:             Number(query.typeCS),
            typeEX:             Number(query.typeEX),
            channel_id:         Number(query.channel_id),
            category_id:        Number(query.category_id),
            sub_genre:          Number(query.sub_genre),
            first_genre:        Number(query.first_genre),
            prgtime:            Number(query.prgtime),
            period:             Number(query.period),
            week0:              Number(query.week0),
            week1:              Number(query.week1),
            week2:              Number(query.week2),
            week3:              Number(query.week3),
            week4:              Number(query.week4),
            week5:              Number(query.week5),
            week6:              Number(query.week6),
            kw_enable:          Number(query.kw_enable),
            overlap:            Number(query.overlap),
            rest_alert:         Number(query.rest_alert),
            criterion_dura:     Number(query.criterion_dura),
            discontinuity:      Number(query.discontinuity),
            sft_start:          query.sft_start,
            sft_end:            query.sft_end,
            split_time:         Number(query.split_time),
            priority:           Number(query.priority),
            autorec_mode:       Number(query.autorec_mode),
            directory:          query.directory,
            filename_format:    query.filename_format,
            trans_mode0:        Number(query.trans_mode0),
            transdir0:          query.transdir0,
            trans_mode1:        Number(query.trans_mode1),
            transdir1:          query.transdir1,
            trans_mode2:        Number(query.trans_mode2),
            transdir2:          query.transdir2,
            ts_del:             Number(query.ts_del)
        }

        let model = this.modelFactory.get("KeywordAddModel");
        model.setOption(option);

        let view = new NormalApiView(response, "KeywordAddModel");
        view.setModels({ KeywordAddModel: model });

        let sockets = SocketIoServer.getInstance().getSockets();
        let socketIoView = new NormalApiSocketIoView(sockets, "KeywordAddModel", "keywordAdd");
        socketIoView.setModels({ KeywordAddModel: model });

        model.addViewEvent(socketIoView);

        model.addViewEvent(view);
        model.execute();
    }
}

export default KeywordPostController;

