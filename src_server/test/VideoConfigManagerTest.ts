"use strict";

import * as chai from 'chai';
const assert = chai.assert;
import VideoConfigManager from '../VideoConfigManager';

describe('VideoConfigManager', () => {
    let manager: VideoConfigManager;

    describe('getInstance', () => {
        it('インスタンスの取得', () => {
            assert.doesNotThrow(() => {
                manager = VideoConfigManager.getInstance();
            });
        });
    });

    describe('getAllLiveVideoConfig', () => {
        it('ライブ配信用設定を取得', () => {
            let config = manager.getAllLiveVideoConfig();
            assert.equal(config.length, 1);
            assert.equal(config[0]["id"], 1);
            assert.equal(config[0]["name"], "1280x720(main)");
            assert.equal(config[0]["command"], "ffmpeg command");
        });
    });

    describe('getAllRecordedVideoConfig', () => {
        it('録画済みビデオ配信用設定を取得', () => {
            let config = manager.getAllRecordedVideoConfig();
            assert.equal(config.length, 1);
            assert.equal(config[0]["id"], 1);
            assert.equal(config[0]["name"], "1280x720(main)");
            assert.equal(config[0]["command"], "ffmpeg command");
        });
    });

    describe('getStreamFilePath', () => {
        it('配信用 tmp ディレクトリパスを取得', () => {
            assert.equal(manager.getStreamFilePath(), "test_config/streamfiles");
        });
    });
});

