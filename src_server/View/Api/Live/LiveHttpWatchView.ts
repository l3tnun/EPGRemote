"use strict";

import * as http from 'http';
import * as child_process from 'child_process';
import ApiView from '../ApiView';
import StreamManager from '../../../Stream/StreamManager';
import Stream from '../../../Stream/Stream'

class LiveHttpWatchView extends ApiView {
    private request: http.ServerRequest;
    private encChild: child_process.ChildProcess;
    private recChild: child_process.ChildProcess;
    private stream: Stream;
    private streamId: number;
    private streamManager: StreamManager = StreamManager.getInstance();

    constructor(_response: http.ServerResponse, _request: http.ServerRequest) {
        super(_response);
        this.response = _response;
        this.request = _request;
    }

    public execute(): void {
        this.log.access.info("view 'LiveHttpWatchViewApiView' was called.");

        let model = this.getModel("LiveHttpWatchModel");

        //エラーチェック
        let errors = model.getErrors();
        if(errors != null) {
            if(errors == 415) {
                this.resposeFormatError();
            } else {
                this.responseServerError();
            }
            return;
        }

        this.stream = model.getResults()["stream"];
        this.streamId = model.getResults()["streamId"];
        this.encChild = model.getResults()["encChild"];
        this.recChild = model.getResults()["recChild"];

        //child エラー処理
        this.setChildErrorProcessing(this.encChild);
        this.setChildErrorProcessing(this.recChild);

        //ffmpeg の結果を response で返す
        this.response.writeHead(200, {
            "Content-Type": "video/mpeg",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
        });
        this.encChild.stdout.pipe(this.response);
        this.stream.countUp();

        //切断時
        this.request.on('close', () => {
            this.stream.countDown();
            this.streamManager.stopStream(this.streamId); //配信停止
        });
    }

    //child エラー発生時処理
    private setChildErrorProcessing(child: child_process.ChildProcess) {
        child.on("exit", () => { this.stream.resetCount(); this.response.end(); });
        child.stdin.on("error", () => { this.stream.resetCount(); this.response.end(); });
    }
}

export default LiveHttpWatchView;

