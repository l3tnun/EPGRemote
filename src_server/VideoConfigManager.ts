"use strict";

import Base from './Base';

/**
* VideoConfigManager
* config から各種配信用設定を取得する
*/
class VideoConfigManager extends Base {
    private static instance: VideoConfigManager;

    public static getInstance(): VideoConfigManager {
        if(!this.instance) {
            this.instance = new VideoConfigManager();
        }

        return this.instance;
    }

    private constructor() { super(); }

    /**
    * ライブ配信用の設定を取得
    */
    public getAllLiveVideoConfig(): any {
        let liveVideoConfig = this.config.getConfig().liveVideoSetting;

        if(typeof liveVideoConfig == "undefined" || typeof liveVideoConfig.length == "undefined" || liveVideoConfig.length == 0) {
            return [];
        }

        return liveVideoConfig;
    }

    /**
    * 録画済みビデオ配信用の設定を取得
    */
    public getAllRecordedVideoConfig(): any {
        let recordedVideoConfig = this.config.getConfig().recordedVideoSetting;

        if(typeof recordedVideoConfig == "undefined" || typeof recordedVideoConfig.length == "undefined" || recordedVideoConfig.length == 0) {
            return [];
        }

        return recordedVideoConfig;
    }

    /**
    * 配信用 tmp ディレクトリパスを取得
    */
    public getStreamFilePath(): string {
        return this.config.getConfig().streamFilePath;
    }
}

export default VideoConfigManager;

