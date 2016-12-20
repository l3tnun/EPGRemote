"use strict";

import * as path from 'path';
import ApiModel from '../ApiModel';
import Sql from '../../../Sql/Sql';

class RecordedVideoPathModel extends ApiModel {
    private getRecordedVideoPathSql: Sql;

    constructor(_getRecordedVideoPathSql: Sql) {
        super();
        this.getRecordedVideoPathSql = _getRecordedVideoPathSql;
    }

    public execute(): void {
        if(this.checkNull(this.option["rec_id"])) {
            this.errors = 415;
            this.eventsNotify();
            return;
        }

        this.getRecordedVideoPathSql.execute(this.option, (rows) => {
            let configJson = this.config.getConfig();
            let ts_file_flg = false; //ts表示

            this.results = []

            //変換済み一覧
            rows[0].forEach((result: { [key: string]: any }) => {
                let videoPath = result["path"].toString('UTF-8').replace(configJson.epgrecConfig.videoPath, "");
                this.results.push({
                    type: 1,
                    id: result["id"],
                    name: result["name"],
                    status: result["status"],
                    path: path.join("/video", videoPath)
                });

                //変換完了でなければ ts を表示する
                if(result["status"] != 2 || result["ts_del"] == 0) { ts_file_flg = true; }
            });

            //ts
            if(ts_file_flg || this.results.length == 0) {
                rows[1].forEach((result: { [key: string]: any }) => {
                    this.results.push({
                        type: 0,
                        id: result["id"],
                        name: "ts",
                        status: 2,
                        path: path.join("/video", result["path"].toString('utf-8')),
                    });
                });
            }

            if(typeof this.option["ios"] != "undefined") {
                this.results.push({
                    RecordedStreamingiOSURL: configJson.RecordedStreamingiOSURL,
                    RecordedDownloadiOSURL: configJson.RecordedDownloadiOSURL
                })
            }

            if(typeof this.option["android"] != "undefined") {
                this.results.push({
                    RecordedStreamingAndroidURL: configJson.RecordedStreamingAndroidURL,
                    RecordedDownloadAndroidURL: configJson.RecordedDownloadAndroidURL
                })
            }

            this.eventsNotify();
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }
}

export default RecordedVideoPathModel;

