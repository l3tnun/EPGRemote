"use strict";

import * as child_process from 'child_process';
import Stream from '../Stream';
import TunerManager from '../../TunerManager';
import LiveHttpEncProcessBuilder from '../ProcessBuilder/LiveHttpEncProcessBuilder';
import RecProcessBuilder from '../ProcessBuilder/RecProcessBuilder';

class HttpStream extends Stream {
    private channel: string;
    private sid: string;
    private tunerId: number;
    private videoId: number;
    private encChild: child_process.ChildProcess;
    private recChild: child_process.ChildProcess;
    private streamNumber: number;

    constructor(_channel: string, _sid: string, _tunerId: number, _videoId: number) {
        super();

        this.channel = _channel;
        this.sid = _sid;
        this.tunerId = _tunerId;
        this.videoId = _videoId;
    }

    public start(streamNumber: number): void {
        //locked tuner
        let tunerManager = TunerManager.getInstance();
        try {
            tunerManager.lockTuner(this.tunerId, streamNumber);
        } catch(e) {
            tunerManager.unlockTuner(streamNumber);
            this.log.stream.error(`tuner id ${ this.tunerId } is locked;`);
            throw e;
        }
        this.streamNumber = streamNumber;

        //run command
        this.encChild = new LiveHttpEncProcessBuilder().build({ videoId: this.videoId });
        this.recChild = new RecProcessBuilder().build({ channel: this.channel, sid: this.sid, tunerId: this.tunerId });
        this.recChild.stdout.pipe(this.encChild.stdin);

        //エラー終了時の処理を追加
        this.setChildErrorProcessing(this.encChild, "encChild", streamNumber);
        this.setChildErrorProcessing(this.recChild, "recChild", streamNumber);
    }

    public stop(): void {
        this.encChild.stdout.removeAllListeners('data');
        this.encChild.stderr.removeAllListeners('data');
        this.recChild.stdout.unpipe();
        this.encChild.kill('SIGKILL');
        this.recChild.kill('SIGTERM');

        //tuner を開放
        TunerManager.getInstance().unlockTuner(this.streamNumber);
    }

    public getStatus(): { [key: string]: any } {
        return {
            channel: this.channel,
            sid: this.sid
        };
    }

    public getType(): string { return "http-live"; }

    public changeWaitTime(): number { return 1000; }

    public getEncChild(): child_process.ChildProcess { return this.encChild; }

    public getRecChild(): child_process.ChildProcess { return this.recChild; }

    //kill Process 時のエラー処理
    private setChildErrorProcessing(child: child_process.ChildProcess, name: string, streamNumber: number): void {
        child.on("exit", () => { this.childProcessExit(name, streamNumber) } );
        child.stdin.on('error', () => { this.childProcessExit(name, streamNumber) } );
    }
}

export default HttpStream;

