"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';
import Util from '../../../Util/Util';

interface RecordedVideoLinkApiModelInterface extends ApiModel {
    update(rec_id: number): void;
    getLink(): { [key: string]: any }[];
    getiOSURL(): { [key: string]: string };
    getAndroidURL(): { [key: string]: string };
}

/**
* RecordedVideoLinkApiModel
*/
class RecordedVideoLinkApiModel implements RecordedVideoLinkApiModelInterface {
    private videoLink: { [key: string]: any }[] = [];
    private iosURL: { [key: string]: string } = {};
    private androidURL: { [key: string]: string } = {};

    /**
    * ビデオリンクの更新
    * @param rec_id program id
    */
    public update(rec_id: number): void {
        let query = { rec_id: rec_id }
        let isIos = Util.uaIsiOS();
        let isAndroid = Util.uaIsAndroid();
        if(isIos) { query["ios"] = 1; }
        if(isAndroid) { query["android"] = 1; }

        m.request({method: "GET", url: `/api/recorded/video?${ m.buildQueryString(query) }`})
        .then((value) => {
            this.iosURL = isIos ? value.pop() : null;
            this.androidURL = isAndroid ? value.pop() : null;
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
    public getLink(): { [key: string]: any }[] {
        return this.videoLink;
    }

    //iOS 用の URL リンクのテンプレートを返す
    public getiOSURL(): { [key: string]: string } {
        return this.iosURL;
    }

    //Android 用の URL リンクのテンプレートを返す
    getAndroidURL(): { [key: string]: string } {
        return this.androidURL;
    }
}

export { RecordedVideoLinkApiModelInterface, RecordedVideoLinkApiModel }

