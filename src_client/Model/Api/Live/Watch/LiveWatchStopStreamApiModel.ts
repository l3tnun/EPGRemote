"use strict";

import * as m from 'mithril';
import ApiModel from '../../ApiModel';

interface LiveWatchStopStreamApiModelInterface extends ApiModel {
    update(streamId: number): void;
}

/**
* ライブ配信停止
*/
class LiveWatchStopStreamApiModel implements LiveWatchStopStreamApiModelInterface {
    /**
    * 配信停止
    * @param streamId stream id
    */
    public update(streamId: number): void {
        if(streamId == null || typeof streamId == "undefined") {
            console.log("LiveWatchStopStreamApiModel streamId is null.");
            return;
        }

        m.request({ method: "DELETE", url: `/api/live/watch?stream=${ streamId }` });
    }
}

export { LiveWatchStopStreamApiModelInterface, LiveWatchStopStreamApiModel };

