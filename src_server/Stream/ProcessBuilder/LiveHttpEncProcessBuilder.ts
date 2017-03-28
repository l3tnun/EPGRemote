"use strict";

import * as child_process from 'child_process';
import ProcessBuilder from './ProcessBuilder';
import VideoConfigManager from '../../VideoConfigManager';

class LiveHttpEncProcessBuilder extends ProcessBuilder {
    private videoConfigManager = VideoConfigManager.getInstance();

    private getEncConfig(videoId: number): string {
        let videoConfig: { [key: string]: any } = {};
        this.videoConfigManager.getAllLiveHttpVideoConfig().map((data: { [key: string]: any }) => {
            if(data["id"] == videoId) { videoConfig = data; }
        });

        let encConfig = videoConfig["command"];

        return encConfig;
    }

    public build(option: { [key: string]: any }): child_process.ChildProcess {
        let encConfig = this.getEncConfig(option["videoId"]).split(" ").filter(Boolean);
        let encCmd = encConfig.shift();

        let encChild = this.spawn(encCmd!, encConfig);

        this.log.stream.info(`run http-enc command pid : ${encChild.pid}`);

        encChild.stderr.on('data', (data) => { this.log.stream.debug(`enc: ${data}`); });

        return encChild;
    }
}

export default LiveHttpEncProcessBuilder;

