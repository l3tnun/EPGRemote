/// <reference path="../../../../extendedTypings/HLS.d.ts" />
"use strict";

import * as m from 'mithril';
import ViewModel from '../../ViewModel';
import { LiveWatchVideoModelInterface } from '../../../Model/LiveWatchVideo/LiveWatchVideoModel';
import { LiveOtherStreamInfoApiModelInterface } from '../../../Model/Api/Live/LiveOtherStreamInfoApiModel';
import { HlsModelInterface } from '../../../Model/Hls/HlsModel';

/**
* LiveWatchVideo の ViewModel
*/
class LiveWatchVideoViewModel extends ViewModel {
    private showModel: LiveWatchVideoModelInterface;
    private liveOtherStreamInfoApiModel: LiveOtherStreamInfoApiModelInterface;
    private hlsModel: HlsModelInterface;

    constructor(
        _showModel: LiveWatchVideoModelInterface,
        _liveOtherModel: LiveOtherStreamInfoApiModelInterface,
        _hlsModel: HlsModelInterface
    ) {
        super();
        this.showModel = _showModel;
        this.hlsModel = _hlsModel;
        this.liveOtherStreamInfoApiModel = _liveOtherModel;
    }

    /**
    * 初期化処理
    * Controller から呼ばれる
    */
    public init(): void {
        this.showModel.init();
    }

    //video が表示可能か確認し、表示可能であれば表示する
    public updateVideoStatus(): void {
        let otherStream = this.liveOtherStreamInfoApiModel.getList();
        if(otherStream.length == 0) { return; }

        otherStream.map((data) => {
            if(data["streamNumber"] == Number(m.route.param("stream")) && data["viewStatus"]) {
                this.show();
            }
        });
    }

    //video を表示させる
    public show(): void {
        this.showModel.show();
    }

    /**
    * video の表示状態を返す
    * true: 表示, false: 非表示
    */
    public getShowStatus(): boolean {
        return this.showModel.get() || typeof m.route.param("stream") == "undefined";
    }

    /**
    * Hls object を生成する
    */
    public createHls(): Hls {
        return this.hlsModel.create();
    }

    /**
    * Hls object destroy
    */
    public HlsDestroy(): void {
        this.hlsModel.destroy();
    }
}

namespace LiveWatchVideoViewModel {
    export const videoPlayerId = "video_player";
}

export default LiveWatchVideoViewModel;

