"use strict";

import ApiModel from '../ApiModel';

class BroadcastModel extends ApiModel {
    public execute(): void {
        this.results = [];
        let broadcast = this.config.getConfig().broadcast

        for(let key in broadcast) {
            if(broadcast[key]) { this.results.push(key); }
        }

        this.eventsNotify();
    }
}

export default BroadcastModel;

