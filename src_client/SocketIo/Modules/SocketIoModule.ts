"use strict";

import SocketIoManager from '../SocketIoManager';

/**
* SocketIoManager に登録する Module クラス
*/
abstract class SocketIoModule {
    private status: boolean = false;
    private socketIoManager: SocketIoManager = SocketIoManager.getInstance();

    //Module の無効化
    public disable(): void {
        this.status = false;
    }

    //Module の有効化
    public enable(): void {
        this.status = true;
    }

    //Module の登録
    public addEvent(): void {
        let io = this.socketIoManager.getIo();
        this.getEventName().map((name: string) => {
            io.on(name, (option:  { [key: string]: any }) => {
                if(!this.status) { return; }

                this.execute(option);
            });
        });
    }

    //登録時の名前を定義する
    public abstract getName(): string;

    //イベント名を定義する
    public abstract getEventName(): string[];

    //Module が有効時に実行される
    public abstract execute(option: { [key: string]: any; }): void;
}

export default SocketIoModule;

