"use strict";

import ApiModel from '../../ApiModel';

interface LiveWatchStopStreamApiModelInterface {
    update(streamId: number): void;
}

/**
* ライブ配信停止
*/
class LiveWatchStopStreamApiModel extends ApiModel implements LiveWatchStopStreamApiModelInterface {
    /**
    * 配信停止
    * @param streamId stream id
    */
    public update(streamId: number): void {
        if(streamId == null || typeof streamId == "undefined") {
            console.log("LiveWatchStopStreamApiModel streamId is null.");
            return;
        }

        this.getRequest({ method: "DELETE", url: `/api/live/watch?stream=${ streamId }` });
    }
}

export { LiveWatchStopStreamApiModelInterface, LiveWatchStopStreamApiModel };

