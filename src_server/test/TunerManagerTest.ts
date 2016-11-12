"use strict";

import * as chai from 'chai';
const assert = chai.assert;
import Util from './Util';
import Server from '../Server';
import TunerManager from '../TunerManager';

describe('TunerManager', () => {
    let server: Server;
    let tuner: TunerManager;

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
                tuner = TunerManager.getInstance();
            });
        });
    });

    describe('lockTuner', () => {
        it('チューナーロック', () => {
            assert.doesNotThrow(() => { tuner.lockTuner(1, 0); });
        });

        it('ロック済みチューナーをロック', () => {
            assert.throws(() => {
                tuner.lockTuner(1, 1);
            },`TunnerManager failed lock tuner`);
        });

        it('存在しないチューナーをロック', () => {
            assert.throws(() => {
                tuner.lockTuner(-1, 2);
            },`TunnerManager not found tuner`)
        });
    });

    describe('getTunerList', () => {
        it('GR チューナーリストを取得', () => {
            let list = tuner.getTunerList("GR");
            assert.equal(list.length, 2);
            list.map((con: { [key: string]: any }) => {
                assert.equal(typeof con["id"], "number");
                assert.equal(con["types"][0], "GR");
                assert.equal(typeof con["command"], "string");
                assert.equal(con["streamId"], -1);
            });
        });


        it('BS, CS チューナーリストを取得', () => {
            let list = tuner.getTunerList("BS");
            assert.equal(list.length, 2);
            list.map((con: { [key: string]: any }) => {
                assert.equal(typeof con["id"], "number");
                assert.equal(con["types"][0], "BS");
                assert.equal(con["types"][1], "CS");
                assert.equal(typeof con["command"], "string");
            });

            assert.equal(list[0]["streamId"], 0); //streamId 0 にロックされている
            assert.equal(list[1]["streamId"], -1);
        });

        it('EX チューナーリストを取得', () => {
            let list = tuner.getTunerList("EX");
            assert.equal(list.length, 0);
        });
    });

    describe('unlockTuner', () => {
        it('チューナーアンロック', () => {
             assert.doesNotThrow(() => { tuner.unlockTuner(0); });
        });

        it('アンロック済みをアンロック', () => {
             assert.doesNotThrow(() => { tuner.unlockTuner(0); });
        });
    });

    describe('getTunerCommand', () => {
        it('チューナーコマンドを取得', () => {
            assert.doesNotThrow(() => { tuner.getTunerCommand(1, '100', 'BS_9'); });
        });

        it('存在しないチューナーコマンドを取得', () => {
            assert.throws(() => {
                tuner.getTunerCommand(-1, '100', 'BS_9');
            },`TunnerManager not found tuner command`);
        });
    });

    describe('notifyRefresh', () => {
        it('socketio の通知', (done) => {
            let notifyCnt = 0;
            let socket = Util.createSocketIoConnection();

            socket.on('connect', () => {
                //refreshTuner が発行される
                tuner.lockTuner(1, 0);
                tuner.unlockTuner(0);
            });

            socket.on("refreshTuner", (value: { [key: string]: any }) => {
                notifyCnt += 1;
                assert.equal(value["status"], "refresh");
                if(notifyCnt == 2) {
                    socket.disconnect();
                    done();
                }
            });

        });
    });
});

