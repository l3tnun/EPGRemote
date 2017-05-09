"use strict";

import * as m from 'mithril';
import Util from '../../Util/Util';
import ViewModel from '../ViewModel';
import { LiveConfigApiModelInterface } from '../../Model/Api/Live/LiveConfigApiModel';
import { LiveStartWatchApiModelInterface } from '../../Model/Api/Live/Watch/LiveStartWatchApiModel';
import { EPGSingleUpdateEpgrecModuleModelInterface } from '../../Model/Api/EpgrecModule/EPGSingleUpdateEpgrecModuleModel';
import { LiveConfigEnableApiModelInterface } from '../../Model/Api/Live/LiveConfigEnableApiModel';
import { LiveHttpConfigApiModelInterface } from '../../Model/Api/Live/LiveHttpConfigApiModel';
import { LiveWatchStreamInfoApiModelInterface } from '../../Model/Api/Live/Watch/LiveWatchStreamInfoApiModel';

/**
* LiveConfig の ViewModel
*/
class LiveProgramDialogContentViewModel extends ViewModel {
    private liveConfigApiModel: LiveConfigApiModelInterface;
    private liveStartWatchApiModel: LiveStartWatchApiModelInterface;
    private epgSingleUpdateEpgrecModuleModel: EPGSingleUpdateEpgrecModuleModelInterface;
    private liveConfigEnableApiModel: LiveConfigEnableApiModelInterface;
    private liveHttpConfigApiModel: LiveHttpConfigApiModelInterface;
    private liveWatchStreamInfoApiModel: LiveWatchStreamInfoApiModelInterface;
    private title: string = "";
    private sid: string;
    private channel: string;
    private channelDisk: string | null = null;
    public enableNewStream: boolean = false; //新規ストリームチェックボックス
    public changeHttpView: boolean = false; //false: HLS, true: http

    constructor(
        _liveConfigApiModel: LiveConfigApiModelInterface,
        _liveStartWatchApiModel :LiveStartWatchApiModelInterface,
        _epgSingleUpdateEpgrecModuleModel: EPGSingleUpdateEpgrecModuleModelInterface,
        _liveConfigEnableApiModel: LiveConfigEnableApiModelInterface,
        _liveHttpConfigApiModel: LiveHttpConfigApiModelInterface,
        _liveWatchStreamInfoApiModel: LiveWatchStreamInfoApiModelInterface
    ) {
        super();

        this.liveConfigApiModel = _liveConfigApiModel;
        this.liveStartWatchApiModel = _liveStartWatchApiModel;
        this.epgSingleUpdateEpgrecModuleModel = _epgSingleUpdateEpgrecModuleModel;
        this.liveConfigEnableApiModel = _liveConfigEnableApiModel;
        this.liveHttpConfigApiModel = _liveHttpConfigApiModel;
        this.liveWatchStreamInfoApiModel = _liveWatchStreamInfoApiModel;
    }

    /**
    * setup
    * @param title ダイアログタイトル
    * @param type 放送波
    * @param channel channel
    * @param sid sid
    * @param chanelDisk channelDisk
    */
    public setup(title: string, type: string, channel: string, sid: string, channelDisk: string | null = null): void {
        if(location.href.indexOf("/live/watch") == -1 || m.route.param("stream") != null) {
            //HLS 視聴時
            this.changeHttpView = !this.enableHLSLive();
        } else {
            //http 視聴時
            this.changeHttpView = true;
        }
        this.title = title;
        this.channel = channel;
        this.sid = sid;
        this.liveConfigApiModel.setType(type);
        this.liveConfigApiModel.setHttp(this.changeHttpView);
        this.channelDisk = channelDisk;
        this.enableNewStream = false;
    }

    /**
    * tuner, video List を取得
    */
    public configListUpdate(): void {
        this.liveConfigApiModel.setHttp(this.changeHttpView);
        this.liveConfigApiModel.update();
    }

    /**
    * tuner List を返す
    * @param streamNumber stream number
    */
    public getTunerList(streamNumber: number | null): any[] {
        let tunerList: any[] = [];

        this.liveConfigApiModel.getTunerList().map((data: { [key: string]: any }) => {
            // /live /program で開かれた時
            if(streamNumber == null) {
                if(data["streamId"] == -1) { tunerList.push(data); }
            } else { // /live/watch で開かれた時
                if(data["streamId"] == streamNumber && !this.enableNewStream) {
                    data["name"] = "このストリーム";
                    tunerList.unshift(data);
                } else if(data["streamId"] == -1){
                    tunerList.push(data);
                }
            }
        });

        return tunerList;
    }

    /**
    * video List を返す
    */
    public getVideoList(): any[] {
        return this.liveConfigApiModel.getVideoList();
    }

    // title を返す
    public getTitle(): string {
        return this.title;
    }

    // channelDisk を返す
    public getChannelDisk(): string | null {
        return this.channelDisk;
    }

    /**
    * stream を開始する
    * @param tunerId tunerId
    * @param videoId videoId
    */
    public startStream(tuner: number, video: number): void {
        this.liveStartWatchApiModel.update (
            this.channel,
            this.sid,
            tuner,
            video
        );
    }

    /**
    * 指定した stream のチャンネル変更をする
    * @param tuner tuner
    * @param video video
    * @param stream stream number
    */
    public changeStream(tuner: number, video: number, stream: number): void {
        this.liveStartWatchApiModel.update (
            this.channel,
            this.sid,
            tuner,
            video,
            stream
        );
    }

    /**
    * EPG を更新する
    */
    public epgUpdate(): void {
        if(this.channelDisk == null) { return; }
        this.epgSingleUpdateEpgrecModuleModel.execute(this.channelDisk);
    }

    /**
    * HLS リアルタイム視聴が有効か返す
    * true: 有効 false: 無効
    */
    public enableHLSLive(): boolean {
        return this.liveConfigEnableApiModel.getHLSLive();
    }

    /**
    * http リアルタイム視聴が有効か返す
    * true: 有効 false: 無効
    */
    public enableHttpLive(): boolean {
        return this.liveConfigEnableApiModel.getHttpLive();
    }

    /**
    * http PC リアルタイム視聴が有効か返す
    * 有効なら true, 無効なら false
    */
    public enableHttpPCLive(): boolean {
        return this.liveConfigEnableApiModel.getHttpPCLive();
    }

    /**
    * http live view 用の link を生成する
    */
    public createHttpLiveLink(tuner: number, video: number): string | null {
        let query = Util.buildQueryStr({
            channel: this.channel,
            sid: this.sid,
            tuner: tuner,
            video: video
        });
        let path = window.location.host + `/api/live/http/watch?${ query }`;
        let iOSPath = window.location.host + encodeURIComponent(`/api/live/http/watch?${ query }`);

        let iOSUrl = this.liveHttpConfigApiModel.getIOS();
        let androidUrl = this.liveHttpConfigApiModel.getAndroid();

        if(Util.uaIsiOS() && iOSUrl != null) {
            return iOSUrl.replace("ADDRESS", iOSPath);
        } else if(Util.uaIsAndroid() && androidUrl != null) {
            return androidUrl.replace("ADDRESS", path);
        } else {
            return null;
        }
    }

    /**
    * http pc view 用の link を生成する
    * query が同じだと null を返す
    */
    public createHttpPCLiveLink(tuner: number, video: number): string | null {
        let query = Util.buildQueryStr({
            channel: this.channel,
            sid: this.sid,
            tuner: tuner,
            video: video
        });

        return Util.buildQueryStr(Util.getCopyQuery()) == query ? null : `/live/watch?${ query }`;
    }

    /**
    * StreamNumber を返す
    */
    public getStreamNumber(): number | null {
        if(location.href.indexOf("/live/watch") == -1) {
            let num = m.route.param("stream");
            return typeof num == "undefined" ? null : Number(num);
        }

        return this.liveWatchStreamInfoApiModel.getInfo()["streamNumber"];
    }
}

export default LiveProgramDialogContentViewModel;

