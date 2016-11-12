"use strict";

import * as fs from 'fs';
import * as path from 'path';
import Stream from '../../Stream/Stream';
import StreamFileDeleter from '../../Stream/StreamFileDeleter'
import Configuration from '../../Configuration';

class DummyStream extends Stream {
    private deleter: StreamFileDeleter;
    private dirPath: string;
    private name: string;

    constructor(_name: string) {
        super();
        this.name = _name;
    }

    public start(streamNumber: number): void {
        this.deleter = new StreamFileDeleter(streamNumber);
        this.deleter.deleteAllFiles();

        let config = Configuration.getInstance().getConfig();
        this.dirPath = config.streamFilePath;

        //dummyファイルを作成する
        this.createDummyFile(`stream${ streamNumber }.m3u8`);
        for(var i = 0; i < 10; i++) {
            this.createDummyFile(`stream${ streamNumber }-0000000${ i }.ts`);
        }
    }

    public stop(): void {
        this.deleter.deleteAllFiles();
    }

    public getStatus(): { [key: string]: any } {
        return {};
    }

    public getType(): string {
        return this.name;
    }

    public changeWaitTime(): number { return 0; }

    //dummy ファイルの作成
    private createDummyFile = (name: string) => {
        fs.writeFileSync(path.join(this.dirPath, name), 'dummy');
    }
}

export default DummyStream;

