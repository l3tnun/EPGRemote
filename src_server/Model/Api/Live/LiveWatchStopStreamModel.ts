"use strict";

import ApiModel from '../ApiModel';
import StreamManager from '../../../Stream/StreamManager';

class LiveWatchStopStreamModel extends ApiModel {
    public execute(): void {
        if(typeof this.option["streamId"] == "undefined") {
            this.errors = 415;
        } else {
            StreamManager.getInstance().stopStream(this.option["streamId"]);
        }

        this.results = {};
        this.eventsNotify();
    }
}

export default LiveWatchStopStreamModel;

