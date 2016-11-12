"use strict";

import ApiModel from '../ApiModel';

class ProgramConfigModel extends ApiModel {
    public execute(): void {
        this.results = {};
        let configJson = this.config.getConfig();

        this.results["recMode"] = configJson.epgrecConfig.recMode;
        this.results["startTranscodeId"] = configJson.epgrecConfig.startTranscodeId;
        this.results["recModeDefaultId"] = configJson.epgrecConfig.recModeDefaultId;
        this.results["programViewConfig"] = configJson.programViewConfig;

        this.eventsNotify();
    }
}

export default ProgramConfigModel;

