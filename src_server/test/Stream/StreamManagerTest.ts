"use strict";

import * as chai from 'chai';
const assert = chai.assert;
import Util from '../Util';
import Server from '../../Server';
import StreamManager from '../../Stream/StreamManager';
import DummyStream from './DummyStream';

describe('StreamManager', () => {
    let server: Server;
    let manager: StreamManager;

    before(() => {
        //socket io のために route が空の Server を用意する
        server = Util.createServer({});
        server.start();
    });

    after(() => {
        server.stop();
    });

    describe('getInstance', () => {
        it('インスタンスの取得', () => {
            assert.doesNotThrow(() => {
                manager = StreamManager.getInstance();
            });
        });
    });

    describe('getStreamStatus', () => {
        it('ストリーム情報取得(空)', () => {
            assert.isNull(manager.getStreamStatus(0));
            assert.isNull(manager.getStreamStatus(1));
            assert.isNull(manager.getStreamStatus(-1));
        });
    });

    describe('getStreamAllStatus', () => {
        it('全てのストリーム情報を取得(空)', () => {
            assert.equal(manager.getStreamAllStatus().length, 0);
        });
    });

    describe('startStream', () => {
        it('ストリーム開始', (done) => {

            let socket = Util.createSocketIoConnection();

            socket.on('connect', () => {
                assert.doesNotThrow(() => { manager.startStream(new DummyStream('stream0')); });
                assert.doesNotThrow(() => { manager.startStream(new DummyStream('stream1')); });

                //ストリームの上限が 2 なのでエラーが発生する
                assert.throws(() => {
                    manager.startStream(new DummyStream('stream2'));
                });
            });


            //stream の状態をチェック
            socket.on("refreshLiveStream", (value: { [key: string]: any }) => {
                assert.equal(value["status"], "start");
            });

            //ストリーム視聴可
            let enableCnt = 0;
            socket.on("enableLiveStream", (value: { [key: string]: any }) => {
                let status = manager.getStreamStatus(value["streamNumber"])!;

                assert.isTrue(status["viewStatus"]);
                assert.isTrue(status["changeChannelStatus"]);
                assert.equal(status["streamType"], 'stream' + enableCnt);

                enableCnt += 1;

                if(enableCnt == 2) {
                    assert.isNull(manager.getStreamStatus(2));

                    //all stream
                    let allStatus = manager.getStreamAllStatus();
                    assert.equal(allStatus.length, 2);
                    allStatus.map((status, index) => {
                        assert.isTrue(status["viewStatus"]);
                        assert.isTrue(status["changeChannelStatus"]);
                        assert.equal(status["streamType"], `stream${ index }`);
                    });

                    socket.disconnect();
                    done();
                }
            });
        });
    });

    describe('changeStreaam', () => {
        it('ストリーム変更', (done) => {
            let socket = Util.createSocketIoConnection();

            socket.on('connect', () => {
                //stream 0 を変更する
                assert.doesNotThrow(() => { manager.changeStreaam(0, new DummyStream('new stream0')); });
            });

            //stream の状態をチェック
            socket.on("refreshLiveStream", (value: { [key: string]: any }) => {
                assert.equal(value["status"], "change");

                let status0 = manager.getStreamStatus(0)!;
                let status1 = manager.getStreamStatus(1)!;

                //stream 0
                assert.isFalse(status0["viewStatus"]);
                assert.isTrue(status0["changeChannelStatus"]);
                assert.equal(status0["streamType"], 'new stream0');

                //stream 1
                assert.isTrue(status1["viewStatus"]);
                assert.isTrue(status1["changeChannelStatus"]);
                assert.equal(status1["streamType"], 'stream1');

            });

            //ストリーム視聴可
            socket.on("enableLiveStream", (value: { [key: string]: any }) => {
                assert.equal(value["streamNumber"], 0);
                socket.disconnect();
                done();
            });
        });
    });

    describe('stopStream', () => {
        it('ストリーム停止', (done) => {
            let socket = Util.createSocketIoConnection();
            let notifyCnt = 0;

            socket.on('connect', () => {
                //stream 0 停止
                assert.doesNotThrow(() => { manager.stopStream(0); });

                setTimeout(() => {
                    //存在しないストリームを停止
                    assert.doesNotThrow(() => { manager.stopStream(-1); });
                }, 10);

                //stream 1 停止
                setTimeout(() => {
                    assert.doesNotThrow(() => { manager.stopStream(1); });
                }, 20);
            });

            socket.on("stopLiveStream", (value: { [key: string]: any }) => {
                if(notifyCnt == 0) {
                    //stream 0
                    assert.equal(value["streamNumber"], 0);
                    assert.isNull(manager.getStreamStatus(0));
                    assert.equal(manager.getStreamAllStatus().length, 1);
                } else if(notifyCnt == 1) {
                    //stream 1
                    assert.equal(value["streamNumber"], 1);
                    assert.isNull(manager.getStreamStatus(1));
                    assert.equal(manager.getStreamAllStatus().length, 0);

                    socket.disconnect();
                    done();
                }

                notifyCnt += 1;
            });
        });
    });
});

