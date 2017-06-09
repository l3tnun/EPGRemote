"use strict";

import * as path from 'path';
import ApiModel from '../ApiModel';
import Sql from '../../../Sql/Sql';
import ModelUtil from '../../ModelUtil';

class KodiRecordedModel extends ApiModel {
    private getKodiRecordedListSql: Sql;

    constructor(_getKodiRecordedListSql: Sql) {
        super();
        this.getKodiRecordedListSql = _getKodiRecordedListSql;
    }

    public execute(): void {
        if(this.checkNull(this.option["length"])) { this.option["length"] = 1000; }
        this.option["asc"] = this.option["asc"] == 1;

        //host
        let configJson = this.config.getConfig().epgrecConfig;
        let epgrecHost = configJson.openHost;
        let epgrecRoot = configJson.rootPath;

        //videoDir を抽出
        let epgrecVideoPath = configJson.videoPath;
        let videoDir = epgrecVideoPath.slice(epgrecRoot.length + 1, epgrecVideoPath.length)

        //thumbsDir を抽出
        let epgrecThumbsPath = configJson.thumbsPath;
        let thumbsDir = epgrecThumbsPath.slice(epgrecRoot.length + 1, epgrecThumbsPath.length)

        this.getKodiRecordedListSql.execute(this.option, (rows) => {
            this.results = [];

            let list = {}
            rows.forEach((data: {}) => {
                if(this.results.length >= this.option["length"]) { return; }

                //トランスコードされた同じ動画を重複させない
                if(typeof list[data["id"]] != "undefined" && list[data["id"]] != null) {
                    //id が小さい(新しい)方を優先する
                    if(list[data["id"]] > data["trans_id"]) {
                        let position;
                        this.results.forEach((video: {}, i: number) => {
                            if(video["id"] == data["id"]) { position = i; }
                        });
                        this.results.splice(position, 1);
                    } else {
                        return;
                    }
                }
                list[data["id"]] = data["trans_id"];

                let tsPath = data["path"].toString('UTF-8');
                let thumbnail = `${ epgrecHost }/` + ModelUtil.encodeURL(`${ thumbsDir }/${ path.basename(tsPath) }.jpg`);

                let videoPath = "";
                let status = data["status"];
                let ts_del = data["ts_del"];
                if(ts_del == null || ts_del == 0 || status == null || status == 0 || status == 1 || status == 3) {
                    //ts only
                    videoPath = `${ epgrecHost }/` + ModelUtil.encodeURL(`${ videoDir }/${ tsPath }`);
                } else {
                    //enc video
                    let enc_path = data["enc_path"].toString('UTF-8');
                    videoPath = `${ epgrecHost }/` + ModelUtil.encodeURL(`${ videoDir }/${ enc_path.slice(epgrecVideoPath.length + 1, enc_path.length) }`);
                }

                this.results.push({
                    id: data["id"],
                    trans_id: data["trans_id"],
                    title: data["title"],
                    detail: data["description"],
                    thumbnail: thumbnail,
                    url: videoPath,
                    duration: (new Date(data["endtime"]).getTime() - new Date(data["starttime"]).getTime()) / 1000
                });
            });

            this.eventsNotify();
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }
}

export default KodiRecordedModel;

