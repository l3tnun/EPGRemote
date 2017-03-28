"use strict";

import ApiModel from '../ApiModel';
import ConfigInterface from '../../../ConfigInterface';

class LiveConfigModel extends ApiModel {
    public execute(): void {
        let config = this.config.getConfig();

        this.results = {};
        this.setValue(config, "enableLiveStream");
        this.setValue(config, "enableLiveHttpStream");
        this.setValue(config, "enableRecordedStream");

        this.eventsNotify();
    }

    private setValue(config: ConfigInterface, name: string): void {
        this.results[name] = (config[name] != null && config[name] === true);
    }
}

export default LiveConfigModel;

