"use strict";

import ApiModel from '../ApiModel';
import Stream from '../../../Stream/Stream'
import StreamManager from '../../../Stream/StreamManager';

class LiveWatchChangeStreamModel extends ApiModel {
    private createStream: (channel: string, sid: string, tunerId: number, videoId: number) => Stream;

    constructor(_createStream: (channel: string, sid: string, tunerId: number, videoId: number) => Stream) {
        super();
        this.createStream = _createStream;
    }

    public execute(): void {
        let streamId = this.option["streamId"];
        let channel = this.option["channel"];
        let sid = this.option["sid"];
        let tunerId = this.option["tunerId"];
        let videoId = this.option["videoId"];

        if( this.checkNull(streamId) || this.checkNull(channel) || this.checkNull(sid) || this.checkNull(tunerId) || this.checkNull(videoId) ) {
            this.errors = 415;

            this.eventsNotify();
            return;
        }

        try {
            StreamManager.getInstance().changeStreaam(streamId, this.createStream(channel, sid, tunerId, videoId));
        } catch(e) {
            this.errors = 500;
        }

        this.results = {};

        this.eventsNotify();
    }
}

export default LiveWatchChangeStreamModel;

