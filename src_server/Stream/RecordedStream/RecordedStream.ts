"use strict";

import * as path from 'path';
import * as child_process from 'child_process';
import Stream from '../Stream';
import RecordedEncProcessBuilder from '../ProcessBuilder/RecordedEncProcessBuilder';
import StreamFileDeleter from '../StreamFileDeleter'
import GetRecordedVideoRealPathSql from '../../Sql/GetRecordedVideoRealPathSql';

class RecordedStream extends Stream {
    private id: number;
    private type: string;
    private videoId: number;
    private recordedEncChild: child_process.ChildProcess;
    private streamNumber: number;

    private fileDeleter: StreamFileDeleter | null = null;

    constructor(_id: number, _type: string, _videoId: number) {
        super();

        this.id = _id;
        this.type = _type;
        this.videoId = _videoId;
    }

    public start(streamNumber: number): void {
        this.streamNumber = streamNumber;

        //ts file のゴミを掃除する
        this.fileDeleter = new StreamFileDeleter(streamNumber);
        this.fileDeleter.deleteAllFiles();

        let configJson = this.config.getConfig();
        let epgrecVideoPath = configJson.epgrecConfig.videoPath;

        //ファイルパスを取得
        new GetRecordedVideoRealPathSql().execute({ id: this.id, type: this.type }, (rows: { [key: string]: any }) => {
            let filePath = "";
            if(typeof rows[0] != "undefined" && typeof rows[0].path != "undefined") {
                filePath = rows[0].path.toString();
                //file が ts の場合
                if(this.type == "0") { filePath = path.join(epgrecVideoPath, filePath); }
            }

            //run command
            this.recordedEncChild =  new RecordedEncProcessBuilder().build({
                streamNumber: streamNumber,
                videoId: this.videoId,
                filePath: filePath
            });

            this.setChildErrorProcessing(this.recordedEncChild, "recordedEncChild", streamNumber);
        },
        () => {
            throw new Error("video is not found error");
        });
    }

    public stop(): void {
        this.recordedEncChild.kill('SIGKILL');

        if(this.fileDeleter == null) { return; }
        this.fileDeleter.deleteAllFiles();
    }

    public getStatus(): { [key: string]: any } {
        return {
            type: this.type,
            id: this.id
        };
    }

    public getType(): string { return "recorded"; }

    public changeWaitTime(): number { return 1000; }

    //kill Process 時のエラー処理
    private setChildErrorProcessing(child: child_process.ChildProcess, name: string, streamNumber: number): void {
        child.on("exit", (code: number) => { if(code != 0) { this.childProcessExit(name, streamNumber); } });
        child.stdin.on('error', () => { this.childProcessExit(name, streamNumber) } );
    }
}

export default RecordedStream;

