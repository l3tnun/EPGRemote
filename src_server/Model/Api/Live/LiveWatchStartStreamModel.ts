"use strict";

import ApiModel from '../ApiModel';
import Stream from '../../../Stream/Stream'
import StreamManager from '../../../Stream/StreamManager';

class LiveWatchStartStreamModel extends ApiModel {
    private createStream: (channel: string, sid: string, tunerId: number, videoId: number) => Stream;

    constructor(_createStream: (channel: string, sid: string, tunerId: number, videoId: number) => Stream) {
        super();
        this.createStream = _createStream;
    }

    public execute(): void {
        let channel = this.option["channel"];
        let sid = this.option["sid"];
        let tunerId = this.option["tunerId"];
        let videoId = this.option["videoId"];

        if( this.checkNull(channel) || this.checkNull(sid) || this.checkNull(tunerId) || this.checkNull(videoId) ) {
            this.errors = 415;

            this.eventsNotify();
            return;
        }

        try {
            let streamId = StreamManager.getInstance().startStream(this.createStream(channel, sid, tunerId, videoId));
            this.results = { streamId: streamId };
        } catch(e) {
            this.errors = 500;
        }

        this.eventsNotify();
    }
}

export default LiveWatchStartStreamModel;

