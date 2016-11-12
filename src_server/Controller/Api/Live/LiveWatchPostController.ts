"use strict";

import * as http from 'http';
import * as url from 'url';
import * as querystring from 'querystring';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';
import View from '../../../View/View';
import Model from '../../../Model/Model';

class LiveWatchPostController extends Controller {
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, postData: string): void {
        this.log.access.info("controller 'LiveWatchPostController' was called.");

        let model: Model;
        let view: View;
        let query = querystring.parse(postData);

        //新規配信
        if(typeof query["stream"] == "undefined") {
            //ライブ視聴
            if(typeof query["id"] == "undefined") {
                model = this.modelFactory.get("LiveWatchStartStreamModel");
                model.setOption({
                    channel: query["channel"],
                    sid: query["sid"],
                    tunerId: Number(query["tuner"]),
                    videoId: Number(query["video"])
                });

                view = new NormalApiView(response, "LiveWatchStartStreamModel");
                view.setModels({ LiveWatchStartStreamModel: model });

            //録画配信
            } else {
                model = this.modelFactory.get("RecordedWatchStartStreamModel");
                model.setOption({
                    id: Number(query["id"]),
                    type: query["type"],
                    videoId: Number(query["video"])
                });

                view = new NormalApiView(response, "RecordedWatchStartStreamModel");
                view.setModels({ RecordedWatchStartStreamModel: model });
            }

        //配信変更
        } else {
            model = this.modelFactory.get("LiveWatchChangeStreamModel");
            model.setOption({
                streamId: Number(query["stream"]),
                channel: query["channel"],
                sid: query["sid"],
                tunerId: Number(query["tuner"]),
                videoId: Number(query["video"])
            });

            view = new NormalApiView(response, "LiveWatchChangeStreamModel");
            view.setModels({ LiveWatchChangeStreamModel: model });
        }

        model.addViewEvent(view);
        model.execute();
    }
}

export default LiveWatchPostController;

