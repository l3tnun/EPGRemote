"use strict";

import ApiModel from '../ApiModel';
import TunerManager from '../../../TunerManager';
import VideoConfigManager from '../../../VideoConfigManager';

class LiveConfigModel extends ApiModel {
    public execute(): void {
        let configJson = this.config.getConfig();
        this.results = {}

        if(!configJson.enableLiveStream && !configJson.enableRecordedStream && !configJson.enableLiveHttpStream) {
            //全て無効
            this.setError("stream");
            return;
        } else if(!configJson.enableRecordedStream && this.option["type"] == "recorded") {
            //録画配信が無効
            this.setError("enableRecordedStream");
            return;
        } else if(!configJson.enableLiveHttpStream && this.option["method"] == "http-live") {
            //http リアルタイム視聴が無効
            this.setError("enableLiveHttpStream");
            return;
        } else if(!configJson.enableLiveStream && typeof this.option["method"] == "undefined") {
            //HLS リアルタイム視聴が無効
            this.setError("enableLiveStream");
            return;
        }

        //set data
        if(typeof this.option["type"] != "undefined" && this.option["type"] == "recorded") {
            //録画配信
            this.results["videoConfig"] = VideoConfigManager.getInstance().getAllRecordedVideoConfig();
        } else {
            //ライブ配信
            if(typeof typeof this.option["type"] != "undefined") {
                this.results["tunerList"] = TunerManager.getInstance().getTunerList(this.option["type"]);
            } else {
                this.results["tunerList"] = [];
            }

            if(typeof this.option["method"] != "undefined" && this.option["method"] == "http-live") {
                //http リアルタイム視聴
                this.results["videoConfig"] = VideoConfigManager.getInstance().getAllLiveHttpVideoConfig();
            } else {
                //HLS リアルタイム視聴
                this.results["videoConfig"] = VideoConfigManager.getInstance().getAllLiveVideoConfig();
            }
        }

        //command を削除
        this.deleteCommand("tunerList");
        this.deleteCommand("videoConfig");

        this.eventsNotify();
    }

    private deleteCommand(name: string): void {
        if(typeof this.results[name] == "undefined") { return; }
        for(let key in this.results[name]) {
            delete this.results[name][key]["command"];
        }
    }

    /**
    * エラーをセットする
    * @param message : エラーメッセージ
    */
    private setError(message: string): void {
        this.log.system.error(`LiveConfigModel ${ message } is not true.`);
        this.errors = 500;
        this.eventsNotify();
    }
}

export default LiveConfigModel;

