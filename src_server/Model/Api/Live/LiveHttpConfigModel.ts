"use strict";

import ApiModel from '../ApiModel';

class LiveHttpConfigModel extends ApiModel {
    public execute(): void {
        let config = this.config.getConfig();

        this.results = {
            HttpLiveViewiOSURL: config.HttpLiveViewiOSURL,
            HttpLiveViewAndroidURL: config.HttpLiveViewAndroidURL
        };

        this.eventsNotify();
    }
}

export default LiveHttpConfigModel;

