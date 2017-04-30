"use strict";

import ApiModel from '../ApiModel';

interface LiveHttpConfigApiModelInterface {
    update(): void;
    getIOS(): string | null;
    getAndroid(): string | null;
}

/**
* http 視聴で必要な URL Scheme を取得する
*/
class LiveHttpConfigApiModel extends ApiModel implements LiveHttpConfigApiModelInterface {
    private iOSURL: string | null = null;
    private androidURL: string | null = null;

    public update(): void {
        this.getRequest({ method: "GET", url: `/api/live/http/config` },
        (value: {}) => {
            if(typeof value["HttpLiveViewiOSURL"] != "undefined") {
                this.iOSURL = value["HttpLiveViewiOSURL"];
            }
            if(typeof value["HttpLiveViewAndroidURL"] != "undefined") {
                this.androidURL = value["HttpLiveViewAndroidURL"];
            }
        },
        "LiveHttpConfigApiModel update error");
    }

    /**
    * iOS 用 URL を返す
    */
    public getIOS(): string | null {
        return this.iOSURL;
    }

    /**
    * android 用 URL を返す
    */
    public getAndroid(): string | null {
        return this.androidURL;
    }
}

export { LiveHttpConfigApiModelInterface, LiveHttpConfigApiModel };

