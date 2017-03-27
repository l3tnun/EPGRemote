"use strict";

import ApiModel from '../ApiModel';
import HttpStream from '../../../Stream/HttpStream/HttpStream'
import StreamManager from '../../../Stream/StreamManager';

class LiveHttpWatchModel extends ApiModel {
    private createStream: (channel: string, sid: string, tunerId: number, videoId: number) => HttpStream;

    constructor(_createStream: (channel: string, sid: string, tunerId: number, videoId: number) => HttpStream) {
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
            let stream = this.createStream(channel, sid, tunerId, videoId);
            let streamId = StreamManager.getInstance().startStream(stream);
            this.results = {
                streamId: streamId,
                encChild: stream.getEncChild(),
                recChild: stream.getRecChild()
            };
        } catch(e) {
            this.errors = 500;
        }

        this.eventsNotify();
    }
}

export default LiveHttpWatchModel;

