"use strict";

import * as child_process from 'child_process';
import ProcessBuilder from './ProcessBuilder';
import VideoConfigManager from '../../VideoConfigManager';

class RecordedEncProcessBuilder extends ProcessBuilder {
    private videoConfigManager = VideoConfigManager.getInstance();

    public build(option: { [key: string]: any }): child_process.ChildProcess {
        let encConfig = this.getEncConfig(option["streamNumber"], option["videoId"]).split(" ").filter(Boolean);
        let encCmd = encConfig.shift();

        //<input> を置換
        encConfig.forEach((value: string, i: number) => { if(value == "<input>") { encConfig[i] = option["filePath"]; } });

        let encChild = this.spawn(encCmd!, encConfig);
        encChild.stderr.on('data', (data) => { this.log.stream.debug(`recorded enc: ${data}`); });

        this.log.stream.info(`run recorded enc command pid : ${encChild.pid}`);

        return encChild;
    }

    private getEncConfig(streamNumber: number, videoId: number): string {
        let videoConfig: { [key: string]: any } = {};
        this.videoConfigManager.getAllRecordedVideoConfig().map((data: { [key: string]: any }) => {
            if(data["id"] == videoId) { videoConfig = data; }
        });

        let encConfig = videoConfig["command"];
        let streamDirPath = this.videoConfigManager.getStreamFilePath();

        encConfig = encConfig.replace(/<streamFilesDir>/g, streamDirPath);
        encConfig = encConfig.replace(/<streamNum>/g, String(streamNumber));

        return encConfig;
    }

}

export default RecordedEncProcessBuilder;

