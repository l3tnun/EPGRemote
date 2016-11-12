"use strict";

import Base from './Base';
import SocketIoServer from './SocketIo/SocketIoServer';

/**
* TunerManager
* tuner の管理を行う
*/
class TunerManager extends Base {
    private static instance: TunerManager;
    private tunerStatus = {};
    private sockets = SocketIoServer.getInstance().getSockets();

    public static getInstance(): TunerManager {
        if(!this.instance) {
            this.instance = new TunerManager();
        }

        return this.instance;
    }

    private constructor() { super(); }

    /**
    * tuner をロックする
    * @param tunerId, tuner id
    * @param streamNumber, tuner を使用する stream の番号
    * @throw TunnerManager failed lock tuner すでに他でロックされていた場合発生する
    * @throw TunnerManager not found tuner tunerId で指定されたチューナーが存在しない場合発生する
    */
    public lockTuner(tunerId: number, streamNumber: number): void {
        if(tunerId in this.tunerStatus) {
            this.log.stream.warn(`tuner No. ${tunerId} is locked by stream No.${this.tunerStatus[tunerId]}`);
            throw new Error(`TunnerManager failed lock tuner`);
        } else {
            //tunerId の チューナーが存在するかチェック
            let tunerIsEmpty = true;
            this.config.getConfig().tuners.map((tuner: { [key: string]: any }) => {
                if(tuner["id"] == tunerId) { tunerIsEmpty = false; }
            });

            if(tunerIsEmpty) { throw new Error(`TunnerManager not found tuner`); }

            //チューナーをロックする
            this.tunerStatus[tunerId] = streamNumber;
            this.log.stream.info(`tuner No. ${tunerId} lock`);
            this.notifyRefresh();
        }
    }

    /**
    * tuner をアンロックする
    * @param @param streamNumber, stream number
    */
    public unlockTuner(streamNumber: number): void {
        for (let key in this.tunerStatus){
            if(this.tunerStatus[key] == streamNumber) {
                delete this.tunerStatus[key];
                this.log.stream.info(`unlocked tuner No. ${ key }`);
                this.notifyRefresh();
                return;
            }
        }

        this.log.stream.warn(`failed unlocked tuner No. ${ streamNumber }`);
    }

    /**
    * チューナーリストを使用されている stream id と一緒に返す
    * @param types GR, BS, CS, EX の放送波を指定する
    */
    public getTunerList(types: string): { [key: string]: any }[] {
        let result: { [key: string]: any }[] = [];
        let json = this.config.getConfig().tuners;

        if(typeof json == "undefined") {
            this.log.stream.info("tuner setting is not found.");
            return [];
        }

        for(let i = 0; i < json.length; i++) {
            if(json[i].types.indexOf(types) >= 0) {
                let streamId = -1;
                if(typeof this.tunerStatus[ json[i].id ] != "undefined") {
                    streamId = Number(this.tunerStatus[ json[i].id ]);
                }

                json[i]["streamId"] = streamId;
                result.push(json[i]);
            }
        }

        this.log.stream.info("return active tuner");
        return result;
    }

    /**
    * チューナーのコマンド文字列を取得する
    * @param id: tuner id
    * @param sid: sid
    * @param channel: channel
    * @throw TunnerManager not found tuner command id で指定したチューナーがない場合発生する
    */
    public getTunerCommand(id: number, sid: string, channel: string): string {
        let json = this.config.getConfig().tuners;
        for(let i = 0; i < json.length; i++) {
            if(json[i].id == id) {
                let cmd = json[i].command.replace("<sid>", sid).replace("<channel>", channel);
                return cmd;
            }
        }

        throw new Error('TunnerManager not found tuner command');
    }

    /**
    * チューナーの状態が変更されたことを socket io で通知する
    */
    private notifyRefresh(): void {
        this.sockets.emit("refreshTuner", { status: "refresh" });
    }
}

export default TunerManager;

