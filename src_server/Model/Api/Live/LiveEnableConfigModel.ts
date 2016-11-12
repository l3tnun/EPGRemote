"use strict";

import ApiModel from '../ApiModel';

class LiveConfigModel extends ApiModel {
    public execute(): void {
        let configJson = this.config.getConfig();

        this.results = {
            enableLiveStream: configJson.enableLiveStream,
            enableRecordedStream: configJson.enableRecordedStream
        };
        this.eventsNotify();
    }
}

export default LiveConfigModel;

