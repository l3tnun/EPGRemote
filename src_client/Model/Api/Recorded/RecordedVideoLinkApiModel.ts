"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';
import Util from '../../../Util/Util';

interface RecordedVideoLinkApiModelInterface {
    update(rec_id: number): void;
    getLink(): { [key: string]: any }[] | null;
    getiOSURL(): { [key: string]: string } | null;
    getAndroidURL(): { [key: string]: string } | null;
    getWindowsURL(): { [key: string]: string } | null;
}

/**
* RecordedVideoLinkApiModel
*/
class RecordedVideoLinkApiModel extends ApiModel implements RecordedVideoLinkApiModelInterface {
    private videoLink: { [key: string]: any }[] | null = null;
    private iosURL: { [key: string]: string } | null = null;
    private androidURL: { [key: string]: string } | null = null;
    private windowsURL: { [key: string]: string } | null = null;

    /**
    * ビデオリンクの更新
    * @param rec_id program id
    */
    public update(rec_id: number): void {
        this.videoLink = null;
        let query = { rec_id: rec_id }
        let isIos = Util.uaIsiOS();
        let isAndroid = Util.uaIsAndroid();
        let isWindows = ( Util.uaIsEdge() || Util.uaIsIE() ) && !Util.uaIsMobile();
        if(isIos) { query["ios"] = 1; }
        if(isAndroid) { query["android"] = 1; }
        if(isWindows) { query["windows"] = 1; }

        this.getRequest({ method: "GET", url: `/api/recorded/video?${ m.buildQueryString(query) }` },
        (value: { [key: string]: any }[]) => {
            this.iosURL = isIos ? <{ [key: string]: string }>(value.pop()) : null;
            this.androidURL = isAndroid ? <{ [key: string]: string }>(value.pop()) : null;
            this.windowsURL = isWindows ? <{ [key: string]: string }>(value.pop()) : null;

            this.videoLink = (typeof value == "undefined" || value.length == 0) ? null : value;
            if(this.videoLink != null && !isWindows) {
                this.videoLink.map((video: any) => { video.path = Util.encodeURL(video.path); });
            }
        },
        "RecordedVideoLinkApiModel update error");
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

    //Windows 用の URL リンクのテンプレートを返す
    getWindowsURL(): { [key: string]: string } | null {
        return this.windowsURL;
    }
}

export { RecordedVideoLinkApiModelInterface, RecordedVideoLinkApiModel }

