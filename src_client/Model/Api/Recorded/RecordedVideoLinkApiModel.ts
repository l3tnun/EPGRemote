"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';
import Util from '../../../Util/Util';

interface RecordedVideoLinkApiModelInterface extends ApiModel {
    update(rec_id: number): void;
    getLink(): { [key: string]: any }[] | null;
    getiOSURL(): { [key: string]: string } | null;
    getAndroidURL(): { [key: string]: string } | null;
}

/**
* RecordedVideoLinkApiModel
*/
class RecordedVideoLinkApiModel implements RecordedVideoLinkApiModelInterface {
    private videoLink: { [key: string]: any }[] | null = null;
    private iosURL: { [key: string]: string } | null = null;
    private androidURL: { [key: string]: string } | null = null;

    /**
    * ビデオリンクの更新
    * @param rec_id program id
    */
    public update(rec_id: number): void {
        this.videoLink = null;
        let query = { rec_id: rec_id }
        let isIos = Util.uaIsiOS();
        let isAndroid = Util.uaIsAndroid();
        if(isIos) { query["ios"] = 1; }
        if(isAndroid) { query["android"] = 1; }

        m.request({method: "GET", url: `/api/recorded/video?${ m.buildQueryString(query) }`})
        .then((value: { [key: string]: any }[]) => {
            this.iosURL = isIos ? <{ [key: string]: string }>(value.pop()) : null;
            this.androidURL = isAndroid ? <{ [key: string]: string }>(value.pop()) : null;
            this.videoLink = (typeof value == "undefined" || value.length == 0) ? null : value;
            if(this.videoLink != null) {
                this.videoLink.map((video: any) => { video.path = Util.encodeURL(video.path); });
            }
        },
        (error) => {
            console.log("RecordedVideoLinkApiModel update error");
            console.log(error);
        });
    }

    //ビデオリンクを返す
    public getLink(): { [key: string]: any }[] | null {
        return this.videoLink;
    }

    //iOS 用の URL リンクのテンプレートを返す
    public getiOSURL(): { [key: string]: string } | null {
        return this.iosURL;
    }

    //Android 用の URL リンクのテンプレートを返す
    getAndroidURL(): { [key: string]: string } | null {
        return this.androidURL;
    }
}

export { RecordedVideoLinkApiModelInterface, RecordedVideoLinkApiModel }

