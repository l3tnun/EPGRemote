"use strict";

import Controller from './Controller';
import TimerManager from '../Util/TimerManager';
import SocketIoManager from '../SocketIo/SocketIoManager';

/**
* 親ページの Controller
* ページ読み込み時に socketIoModule をすべて無効化する
* enableSocketIoModules で必要な SocketIoModule を有効化させる
* ページ離脱時に TimerManager ですべてのタイマーを停止させる onunload
*/
abstract class ParentPageController extends Controller {
    protected socketIoManager: SocketIoManager = SocketIoManager.getInstance();

    /*
    * 必要な SocketIoModule を有効化する
    * 有効化するモジュールがあれば override する
    */
    protected enableSocketIoModules(): void {
        this.socketIoManager.enableModule("refreshLiveStream");
        this.socketIoManager.enableModule("stopLiveStream");
    }

    //ページから離れるときに呼び出される
    public onRemove(): void {
        //ページが切り替わるごとにタイマーを停止させる
        TimerManager.getInstance().stopAll();
    }

    protected initModel(): void {
        super.initModel();
        this.socketIoManager.init();
        this.enableSocketIoModules();
    }
}

export default ParentPageController;

