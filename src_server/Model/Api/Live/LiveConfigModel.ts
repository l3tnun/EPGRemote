"use strict";

import ApiModel from '../ApiModel';
import TunerManager from '../../../TunerManager';
import VideoConfigManager from '../../../VideoConfigManager';

class LiveConfigModel extends ApiModel {
    public execute(): void {
        let configJson = this.config.getConfig();
        this.results = {}

        //HLS が無効
        if(configJson.enableLiveStream == false && configJson.enableRecordedStream == false) {
            this.log.system.error("LiveConfigModel stream is not true.");
            this.errors = 500;
            this.eventsNotify();
            return;
        }

        //録画配信が無効
        if(configJson.enableRecordedStream == false && this.option["type"] == "recorded") {
            this.log.system.error("LiveConfigModel enableRecordedStream is not true.");
            this.errors = 500;
            this.eventsNotify();
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
            this.results["videoConfig"] = VideoConfigManager.getInstance().getAllLiveVideoConfig();
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
}

export default LiveConfigModel;

