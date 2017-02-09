"use strict";

import * as m from 'mithril';
import ApiModel from '../../ApiModel';

interface LiveRecordedStartWatchApiModelInterface extends ApiModel {
    update(id: number, type: number, video: number, stream?: number | null): void;
}

/**
* stream を開始する
* @throw LiveRecordedStartWatchApiModelUpdateError stream 開始に失敗した時に発生する
*/
class LiveRecordedStartWatchApiModel implements LiveRecordedStartWatchApiModelInterface {
    /**
    * server から video, tuner 情報を取得する
    * @param id videoId
    * @param type 0: ts, 1: 非ts
    * @param video: video config id
    * @param stream: streamId //サーバー側が未実装
    * @throw LiveRecordedStartWatchApiModelUpdateError stream 開始に失敗した時に発生する
    */
    public update(id: number, type: number, video: number, stream: number | null = null): void {
        let query = {
            type: type,
            id: id,
            video: video
        };

        if(stream != null) { query["stream"] = stream; }

        m.request({
            method: "POST",
            url: "/api/live/watch",
            data: m.buildQueryString(query)
        })
        .then((value) => {
            let stream = value["streamId"];

            //チャンネル切り替えの時は何もしない
            if(typeof stream == "undefined" || stream == null) { return; }
            m.route.set(`/live/watch?stream=${ stream }`);
        },
        (error) => {
            if(stream == null) { console.log("録画番組のストリーム開始に失敗しました。"); }
            else { console.log("録画番組のチャンネル変更に失敗しました。"); }

            console.log(error);
            console.log(query);
            throw new Error("LiveRecordedStartWatchApiModelUpdateError");
        });
    }
}

export { LiveRecordedStartWatchApiModelInterface, LiveRecordedStartWatchApiModel };

