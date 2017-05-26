"use strict";

import Util from '../../Util/Util';
import ViewModel from '../ViewModel';
import { BroadCastApiModelInterface } from '../../Model/Api/BroadCastApiModel';
import { LiveOtherStreamInfoApiModelInterface } from '../../Model/Api/Live/LiveOtherStreamInfoApiModel';
import { LiveConfigEnableApiModelInterface } from '../../Model/Api/Live/LiveConfigEnableApiModel';
import { LiveHttpConfigApiModelInterface } from '../../Model/Api/Live/LiveHttpConfigApiModel';
import { ControllerStatus } from '../../Enums';

/**
* Navigation の ViewModel
*/
class NavigationViewModel extends ViewModel {
    private broadCastApiModel: BroadCastApiModelInterface;
    private liveOtherStreamInfoApiModel: LiveOtherStreamInfoApiModelInterface;
    private liveConfigEnableApiModel: LiveConfigEnableApiModelInterface;
    private liveHttpConfigApiModel: LiveHttpConfigApiModelInterface;
    private inited: boolean = false;

    constructor(
        _broadCast: BroadCastApiModelInterface,
        _liveOtherModel: LiveOtherStreamInfoApiModelInterface,
        _liveConfigEnableApiModel: LiveConfigEnableApiModelInterface,
        _liveHttpConfigApiModel: LiveHttpConfigApiModelInterface
    ) {
        super();

        this.broadCastApiModel = _broadCast;
        this.liveOtherStreamInfoApiModel = _liveOtherModel;
        this.liveConfigEnableApiModel = _liveConfigEnableApiModel;
        this.liveHttpConfigApiModel = _liveHttpConfigApiModel;
    }

    public init(status: ControllerStatus): void {
        if(status == "reload") {
            this.liveOtherStreamInfoApiModel.update();
        }

        if(this.inited) { return; }

        this.broadCastApiModel.update();
        this.liveOtherStreamInfoApiModel.update();
        this.liveConfigEnableApiModel.update();
        this.liveHttpConfigApiModel.update();
        this.inited = true;
    }

    //有効な放送波を返す
    public getBroadCastList(): string[] {
        return this.broadCastApiModel.getList();
    }

    //配信中のストリーム情報を返す
    public getLiveOtherStreamInfoList(): any[] {
        return this.liveOtherStreamInfoApiModel.getList();
    }

    /**
    * ライブ配信が有効か返す
    * 有効 true, 無効 false
    */
    public enableLive(): boolean {
        if(Util.uaIsiOS() || Util.uaIsAndroid()) {
            //ios or android の場合
            return this.liveConfigEnableApiModel.getHLSLive() || this.liveConfigEnableApiModel.getHttpLive();
        } else {
            return this.liveConfigEnableApiModel.getHLSLive() || this.liveConfigEnableApiModel.getHttpPCLive();
        }
    }

    /**
    * 録画配信が有効か返す
    * 有効 true, 無効 false
    */
    public enableRecorded(): boolean {
        return this.liveConfigEnableApiModel.getRecorded();
    }

    /**
    * http View の iOS 用 URL を返す
    */
    public getHttpViewIOSURL(): string | null {
        return this.liveHttpConfigApiModel.getIOS();
    }

    /**
    * http View の android 用 URL を返す
    */
    public getHttpViewAndroidURL(): string | null {
        return this.liveHttpConfigApiModel.getAndroid();
    }
}

export default NavigationViewModel;

