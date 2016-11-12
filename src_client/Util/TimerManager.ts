"use strict";

/**
* setTimeout 処理が必要な処理のタイマー管理を行う
*/

class TimerManager {
    private static instance: TimerManager;
    private timers: { [key: string]: number; } = {};

    public static getInstance(): TimerManager {
        if(!this.instance) {
            this.instance = new TimerManager();
        }

        return this.instance;
    }

    private constructor() {}

    /**
    * 処理を追加
    * @param name 登録時の名前
    * @param time 処理の待ち時間 (ミリ秒)
    * @param callback 処理内容, callback で渡す
    */
    public add(name: string, time: number, callback: (...args: any[]) => void): void {
        if(time < 0) { time = 10000; }

        //すでに登録されていたら停止する
        if(typeof this.timers[name] != "undefined") { this.stop(name); }

        //登録
        this.timers[name] = window.setTimeout(callback, time);
    }

    /**
    * 指定されたタイマーの停止
    * @param 処理名
    */
    public stop(name: string): void {
        clearTimeout(this.timers[name]);
        delete this.timers[name];
    }

    /**
    * すべてのタイマーを停止
    */
    public stopAll(): void {
        for(let name in this.timers) { this.stop(name); }
    }
}

export default TimerManager;

