"use strict";

import ApiModel from '../ApiModel';
import Util from '../../../Util/Util';

interface LiveConfigEnableApiModelInterface {
    update(): void;
    getHLSLive(): boolean;
    getHttpLive(): boolean;
    getHttpPCLive(): boolean;
    getRecorded(): boolean;
}

/**
* ライブ配信、録画配信が有効になっているかサーバから取得する
*/
class LiveConfigEnableApiModel extends ApiModel implements LiveConfigEnableApiModelInterface {
    private enableHLSLive: boolean = false;
    private enableRecorded: boolean = false;
    private enableHttpLive: boolean = false;
    private enableHttpPCLive: boolean = false;

    public update(): void {
        this.getRequest({ method: "GET", url: `/api/live/config/enable` },
        (value: {}) => {
            this.enableHLSLive = value["enableLiveStream"];
            this.enableRecorded = value["enableRecordedStream"];
            this.enableHttpLive = value["enableLiveHttpStream"];
            this.enableHttpPCLive = value["enableLivePCHttpStream"];
        },
        "LiveConfigEnableApiModel update error");
    }

    /**
    * HLS リアルタイム視聴が有効か返す
    * 有効なら true, 無効なら false
    */
    public getHLSLive(): boolean {
        return this.enableHLSLive;
    }

    /**
    * http リアルタイム視聴が有効か返す
    * 有効なら true, 無効なら false
    */
    public getHttpLive(): boolean {
        return this.enableHttpLive && ( Util.uaIsiOS() || Util.uaIsAndroid() );
    }

    /**
    * http PC リアルタイム視聴が有効か返す
    * 有効なら true, 無効なら false
    */
    public getHttpPCLive(): boolean {
        return this.enableHttpPCLive && ( Util.uaIsChrome() || Util.uaIsFirefox() || Util.uaIsEdge() || Util.uaIsIE() ) && !Util.uaIsiOS() && !Util.uaIsAndroid();
    }

    /**
    * 録画配信が有効か返す
    * 有効なら true, 無効なら false
    */
    public getRecorded(): boolean {
        return this.enableRecorded;
    }
}

export { LiveConfigEnableApiModelInterface, LiveConfigEnableApiModel };

