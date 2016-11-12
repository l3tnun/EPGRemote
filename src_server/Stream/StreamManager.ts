"use strict";

import * as fs from 'fs';
import Base from '../Base';
import SocketIoServer from '../SocketIo/SocketIoServer';
import Stream from './Stream';
import StreamStatus from './StreamStatus';

/**
* StreamManager
* ストリームの管理を行う
* ストリームの登録、開始、停止、変更
*/
class StreamManager extends Base {
    private static instance: StreamManager;
    private sockets = SocketIoServer.getInstance().getSockets();

    private streamStatus: { [key: number]: StreamStatus } = {};

    public static getInstance(): StreamManager {
        if(!this.instance) {
            this.instance = new StreamManager();
        }

        return this.instance;
    }

    private constructor() { super(); }

    /**
    * 指定されたストリームの情報を取得する
    * @param num: stream id
    */
    public getStreamStatus(num: number): { [key: string]: any } | null {
        if(typeof this.streamStatus[num] == "undefined" || this.streamStatus[num].stream == null) { return null; }

        let result = this.streamStatus[num].stream!.getStatus();

        result["streamNumber"] = num;
        result["viewStatus"] = this.streamStatus[num].viewStatus;
        result["changeChannelStatus"] = this.streamStatus[num].changeChannelStatus;
        result["streamType"] = this.streamStatus[num].stream!.getType();

        return result;
    }

    /**
    * 全てのストリーム情報を取得する
    */
    public getStreamAllStatus(): { [key: string]: any }[] {
        let result: { [key: string]: any }[] = [];

        for(let key in this.streamStatus) {
            let stream: { [key: string]: any } | null = this.getStreamStatus(Number(key));
            if(stream != null) {
                result.push(stream);
            }
        }

        return result;
    }

    /**
    * ストリームを開始する
    * @param stream: Stream
    */
    public startStream(stream: Stream): number {
        //空きストリームの確保
        let streamNumber = this.getEmptyStreamNumber();

        if(streamNumber == -1 || typeof this.streamStatus[streamNumber] != "undefined") { throw new Error("start Stream error"); }

        let streamStatus = new StreamStatus();
        this.streamStatus[streamNumber] = streamStatus;

        if(this.runStream(streamNumber, stream)) {
            this.notifyChangeStreamStatus('start', streamNumber);
            return streamNumber;
        } else {
            throw new Error("start Stream error");
        }
    }

    /**
    * 指定されたストリームを変更する
    * @param streamNumber: stream id
    * @param stream: Stream
    */
    public changeStreaam(streamNumber: number, stream: Stream): void {
        this.log.stream.info(`change stream No. ${streamNumber}`);
        if(typeof this.streamStatus[streamNumber] == "undefined" || this.streamStatus[streamNumber].stream == null) {
            throw new Error("change Stream Error");
        }

        let waitTime = this.streamStatus[streamNumber].stream!.changeWaitTime();

        this.streamStatus[streamNumber].changeChannelStatus = false;
        this.streamStatus[streamNumber].viewStatus = false;
        this.stopStream(streamNumber);

        //rec command が正しく動作しないため少し待つ
        setTimeout(() => {
            if(this.runStream(streamNumber, stream)) {
                this.notifyChangeStreamStatus('change', streamNumber);
            }
        }, waitTime);
    }

    /**
    * 指定されたストリームを停止する
    * @param streamNumber: stream id
    */
    public stopStream(streamNumber: number): void {
        if(typeof this.streamStatus[streamNumber] == "undefined" || this.streamStatus[streamNumber].stream == null) {
            this.log.stream.warn(`not runnning No.${streamNumber}`);
            return;
        }

        this.streamStatus[streamNumber].stream!.stop();

        if(this.streamStatus[streamNumber].changeChannelStatus) {
            delete this.streamStatus[streamNumber];
            this.log.stream.info(`stop stream No.${ streamNumber }`);

            this.notifyStopStream(streamNumber);
        }
    }

    private runStream(streamNumber: number, stream: Stream): boolean {
        try {
            stream.start(streamNumber);
        } catch(e) {
            delete this.streamStatus[streamNumber];
            this.log.stream.info(`streamManager runStream error`);
            return false;
        }

        this.streamStatus[streamNumber].stream = stream;

        this.checkStreamEnable(streamNumber); //視聴可能になるまで監視
        this.streamStatus[streamNumber].changeChannelStatus = true;
        this.log.stream.info(`start stream No. ${streamNumber}`);

        return true;
    }

    private getEmptyStreamNumber(): number {
        let max = this.config.getConfig().maxStreamNumber;

        for(let i = 0; i < max; i++) { if(typeof this.streamStatus[i] == "undefined") { return i; } }
        return -1;
    }

    //ファイルが再生可能になるまで監視する
    private checkStreamEnable(streamNumber: number): void {
        let dirPath = this.config.getConfig().streamFilePath;

        let id = setInterval(() => {
            if(typeof this.streamStatus[streamNumber] == "undefined" || !this.streamStatus[streamNumber].changeChannelStatus) {
                clearInterval(id);
                return;
            }

            let fileList = fs.readdirSync(dirPath)

            let tsFileCount = 0;
            let m3u8Flag = false;
            fileList.map((file: string) => {
                if(file.match(`stream${streamNumber}`)) {
                    if(file.match(".m3u8")) { m3u8Flag = true; }
                    if(file.match(".ts")) { tsFileCount += 1; }
                }
            });

            if(m3u8Flag && tsFileCount >= 3) {
                clearInterval(id);
                this.streamStatus[streamNumber].viewStatus = true;
                this.log.stream.info("notifyEnableStream: " + streamNumber);
                this.sockets.emit("enableLiveStream", { streamNumber: streamNumber });
            }
        }, 100);
    }

    //socketio ストリームの状態が変わった時の通知
    private notifyChangeStreamStatus(status: string, streamNumber: number): void {
        this.log.stream.info("notifyChangeStreamStatus");
        this.sockets.emit("refreshLiveStream", { status: status, streamNumber: streamNumber });
    }

    private notifyStopStream(streamNumber: number): void {
        this.log.stream.info("notifyStopStream: " + streamNumber);
        this.sockets.emit("stopLiveStream", { streamNumber: streamNumber });
    }
}

export default StreamManager;

