"use strict";

import * as fs from 'fs';
import * as path from 'path';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../Util';
import Configuration from '../../Configuration';
import ConfigInterface from '../../ConfigInterface';
import StreamFileDeleter from '../../Stream/StreamFileDeleter';

describe('StreamFileDeleter', () => {
    let deleter: StreamFileDeleter;
    let config: ConfigInterface;
    let dirPath: string;

    before(() => {
        Util.initLogger();
        Util.initConfiguration();
        config = Configuration.getInstance().getConfig();
        dirPath = config.streamFilePath;

        rmDummyFiles();//dummy ファイルを全て削除
    });

    after(() => {
        createDummyFile('.gitkeep');
    });

    describe('getInstance', () => {
        it('インスタンスの取得', () => {
            assert.doesNotThrow(() => {
                deleter = new StreamFileDeleter(0);
            });
        });
    });

    describe('deleteAllFiles', () => {
        it('全てのファイルを削除する', (done) => {
            //dumy ファイル作成
            createDummyFile('stream0.m3u8');
            createDummyFile('stream0-00000001.ts');
            assert.equal(getFileList().length, 2);

            deleter.deleteAllFiles(); //ファイル削除

            //ファイルが削除されるのを待つ
            setTimeout(() => {
                assert.equal(getFileList().length, 0);
                done();
            }, 100);
        });
    });

    describe('startAndStopDeleteTsFiles', () => {
        it('ファイルを 20 個に維持する', (done) => {
            //dumy ファイル作成
            createDummyFile('stream0.m3u8');
            for(let i = 0; i < 25; i++) { createDummyFile(`stream0-0000000${ i }.ts`); }
            assert.equal(getFileList().length, 26);

            //ファイル削除開始
            deleter.startDeleteTsFiles(0);

            setTimeout(() => {
                //削除するのを停止する
                assert.doesNotThrow(() => { deleter.stopDelteTsFiles(); });

                //stream0.m3u8 + stream0-*.ts で 21 個
                assert.equal(getFileList().length, 21);

                rmDummyFiles(); //ゴミを削除
                setTimeout(() => { done(); }, 100);
            }, 100);
        });
    });

    //dummy ファイルの作成
    let createDummyFile = (name: string) => {
        fs.writeFileSync(path.join(dirPath, name), '');
    }

    //dummy ファイルを全て削除
    let rmDummyFiles = () => {
        getFileList().map((file: string) => { fs.unlink(path.join(dirPath, file), () => {}); });
    }

    let getFileList = () => {
        return fs.readdirSync(dirPath);
    }
});

