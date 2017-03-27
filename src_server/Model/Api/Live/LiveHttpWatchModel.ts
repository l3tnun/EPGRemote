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
            let manager = StreamManager.getInstance();
            let stream: HttpStream | null = null;
            let streamId: number | null = null;

            //同一パラメーターの Stream を探す
            manager.getStreamAllStatus().map((info: { [key: string]: any }) => {
                if(info["streamType"] != "http-live") { return; }
                if(info["channel"] == channel && info["sid"] == sid && info["tunerId"] == tunerId && info["videoId"] == videoId) {
                    stream = <HttpStream>manager.getStream(info["streamNumber"]);
                    streamId = info["streamNumber"];
                    console.log(stream);
              }
            });

            //同一パラメーターの Stream が見つからない場合
            if(stream == null || streamId == null) {
                stream = this.createStream(channel, sid, tunerId, videoId);
                streamId = manager.startStream(stream);
            }

            this.results = {
                streamId: streamId,
                stream: stream,
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

