"use strict";

import * as m from 'mithril';
import ApiModel from '../../ApiModel';

interface LiveStartWatchApiModelInterface extends ApiModel {
    update(channel: string, sid: string, tuner: number, video: number, stream?: number | null): void;
}

/**
* stream を開始する
* @throw LiveStartWatchApiModelUpdateError stream 開始に失敗した時に発生する
*/
class LiveStartWatchApiModel implements LiveStartWatchApiModelInterface {
    /**
    * server から video, tuner 情報を取得する
    * @param channel channel
    * @param sid sid
    * @param tuner tuner
    * @param video video
    * @param stream stream number
    * @throw LiveStartWatchApiModelUpdateError stream 開始に失敗した時に発生する
    */
    public update(channel: string, sid: string, tuner: number, video: number, stream: number | null = null): void {
        let query = {
            channel: channel,
            sid: sid,
            tuner: tuner,
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
            if(stream == null) { console.log("ストリーム開始に失敗しました。"); }
            else { console.log("チャンネル変更に失敗しました。"); }

            console.log(error);
            console.log(query);
            throw new Error("LiveConfigApiModelExecuteError");
        });
    }
}

export { LiveStartWatchApiModelInterface, LiveStartWatchApiModel };

