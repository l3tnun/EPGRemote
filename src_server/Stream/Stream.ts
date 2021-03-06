"use strict";

import Base from '../Base';
import StreamManager from './StreamManager'

abstract class Stream extends Base {
    private viewerCnt: number = 0;

    public abstract start(streamNumber: number): void;
    public abstract stop(): void;
    public abstract getStatus(): { [key: string]: any }; //Stream 固有の情報を返す
    public abstract getType(): string; //Stream を区別するための文字列を返す
    public abstract changeWaitTime(): number; //ストリーム変更時に待つ時間

    //外部プログラムが終了した時の処理
    protected childProcessExit(name: string, streamNumber: number): void {
        let streamManager = StreamManager.getInstance();
        let streamStatus = streamManager.getStreamStatus(streamNumber);

        if(streamStatus == null) { return; }

        if(streamStatus["changeChannelStatus"]) {
            this.log.stream.error('killed process ' + name + ' stream No. ' + streamNumber);
            streamManager.stopStream(streamNumber);
        }
    }

    public countUp(): void { this.viewerCnt += 1; }
    public countDown(): void { this.viewerCnt -= 1; }
    public resetCount(): void { this.viewerCnt = 0; }
    public getCount(): number { return this.viewerCnt; }
}

export default Stream;

