"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';

interface LiveHttpConfigApiModelInterface extends ApiModel {
    update(): void;
    getIOS(): string | null;
    getAndroid(): string | null;
}

/**
* http 視聴で必要な URL Scheme を取得する
*/
class LiveHttpConfigApiModel implements LiveHttpConfigApiModelInterface {
    private iOSURL: string | null = null;
    private androidURL: string | null = null;

    public update(): void {
        m.request({ method: "GET", url: `/api/live/http/config` })
        .then((value) => {
            if(typeof value["HttpLiveViewiOSURL"] != "undefined") {
                this.iOSURL = value["HttpLiveViewiOSURL"];
            }
            if(typeof value["HttpLiveViewAndroidURL"] != "undefined") {
                this.androidURL = value["HttpLiveViewAndroidURL"];
            }
        },
        (error) => {
            console.log('LiveHttpConfigApiModel update error');
            console.log(error);
        });
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

