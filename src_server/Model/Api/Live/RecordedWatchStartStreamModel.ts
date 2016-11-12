"use strict";

import ApiModel from '../ApiModel';
import Stream from '../../../Stream/Stream'
import StreamManager from '../../../Stream/StreamManager';

class RecordedWatchStartStreamModel extends ApiModel {
    private createStream: (id: number, type: string, videoId: number) => Stream;

    constructor(_createStream: (id: number, type: string, videoId: number) => Stream) {
        super();
        this.createStream = _createStream;
    }

    public execute(): void {
        let id = this.option["id"];
        let type = this.option["type"];
        let videoId = this.option["videoId"];

        if( this.checkNull(id) || this.checkNull(type) || this.checkNull(videoId) ) {
            this.errors = 415;

            this.eventsNotify();
            return;
        }

        try {
            let streamId = StreamManager.getInstance().startStream(this.createStream(id, type, videoId));
            this.results = { streamId: streamId };
        } catch(e) {
            this.errors = 500;
        }

        this.eventsNotify();
    }
}

export default RecordedWatchStartStreamModel;

