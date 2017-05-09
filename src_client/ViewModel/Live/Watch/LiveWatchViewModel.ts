"use strict";

import * as m from 'mithril';
import ViewModel from '../../ViewModel';
import { BroadCastApiModelInterface } from '../../../Model/Api/BroadCastApiModel';
import { LiveWatchStopStreamApiModelInterface } from '../../../Model/Api/Live/Watch/LiveWatchStopStreamApiModel';
import { LiveConfigEnableApiModelInterface } from '../../../Model/Api/Live/LiveConfigEnableApiModel';

/**
* LiveWatch の ViewModel
*/
class LiveWatchViewModel extends ViewModel {
    private broadCastApiModel: BroadCastApiModelInterface;
    private stopStreamApiModel: LiveWatchStopStreamApiModelInterface;
    private liveConfigEnableApiModel: LiveConfigEnableApiModelInterface;
    public tabStatus = false;

    constructor(
        _broadCast: BroadCastApiModelInterface,
        _stopStreamApiModel: LiveWatchStopStreamApiModelInterface,
        _liveConfigEnableApiModel: LiveConfigEnableApiModelInterface
    ) {
        super();

        this.broadCastApiModel = _broadCast;
        this.stopStreamApiModel = _stopStreamApiModel;
        this.liveConfigEnableApiModel = _liveConfigEnableApiModel;
    }

    //初期化処理
    public init(): void {
        //tab の状態を初期化する
        this.tabStatus = false;
    }

    //有効な放送波を返す
    public getBroadCastList(): string[] {
        return this.broadCastApiModel.getList();
    }

    /**
    * stream 停止
    * @param streamId stream id
    */
    public stopStream(streamId: number): void {
        this.stopStreamApiModel.update(streamId);
    }

    /**
    * live stream が有効か返す true: 有効, false: 無効
    */
    public liveIsEnable(): boolean {
        return this.liveConfigEnableApiModel.getHLSLive() || ( this.liveConfigEnableApiModel.getHttpPCLive() && m.route.param("stream") == null);
    }
}

export default LiveWatchViewModel;

