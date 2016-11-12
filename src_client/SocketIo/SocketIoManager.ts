"use strict";

import * as io from 'socket.io-client';
import SocketIoModule from './Modules/SocketIoModule';

/**
* SocketIoModule の初期化、有効化を行う
* @throw SocketIoManagerEnableModuleError name で指定した Module がない場合発生する
*/
class SocketIoManager {
    private static instance: SocketIoManager;
    private io: SocketIOClient.Socket = io.connect(window.location.protocol + "//" + window.location.host);
    private id: string = `${new Date().getTime()}:${Math.random().toString(36).slice(-8)}`;
    private modules: { [key: string]: SocketIoModule } = {}

    public static getInstance(): SocketIoManager {
         if(!this.instance) {
            this.instance = new SocketIoManager();
        }

        return this.instance;
    }

    private constructor() {}

    //socket を返す
    public getIo(): SocketIOClient.Socket {
        return this.io;
    }

    /**
    * server と socketio で通信時に使用できる id
    * 各クライアントで重複しない
    */
    public getId(): string {
        return this.id;
    }

    /*
    * 初期化処理
    * 登録されている Module をすべて disable する
    */
    public init(): void {
        for(let name in this.modules) {
            this.modules[name].disable();
        }
    }

    /**
    * Module を追加
    * @param moduleObject SocketIoModule のインスタンス
    */
    public addModule(moduleObject: SocketIoModule): void {
        let name = moduleObject.getName();
        this.modules[name] = moduleObject;
        this.modules[name].disable();
        this.modules[name].addEvent();
    }

    /**
    * 指定されたイベント名の Module を有効化する
    * @param name イベント名
    * @throw SocketIoManagerEnableModuleError name で指定した Module がない場合発生する
    */
    public enableModule(name: string): void {
        if(typeof this.modules[name] == "undefined") {
            console.log(`${name} is not found.`);
            throw new Error("SocketIoManagerEnableModuleError");
        }

        this.modules[name].enable();
    }
}

export default SocketIoManager;

