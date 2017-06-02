"use strict";

import * as m from 'mithril';
import ViewModel from '../ViewModel';
import Util from '../../Util/Util';
import { ProgramApiModelInterface } from '../../Model/Api/Program/ProgramApiModel';
import { ProgramConfigApiModelInterface } from '../../Model/Api/Program/ProgramConfigApiModel';
import { LiveConfigEnableApiModelInterface } from '../../Model/Api/Live/LiveConfigEnableApiModel';
import { ControllerStatus } from '../../Enums';

interface ProgramCacheStructure {
    autorec: number;
    recorded: boolean;
    element: Element[];
}

/**
* Program の ViewModel
*/

class ProgramViewModel extends ViewModel {
    private programApiModel: ProgramApiModelInterface;
    private programConfigApiModel: ProgramConfigApiModelInterface;
    private liveConfigEnableApiModel: LiveConfigEnableApiModelInterface;
    private headerHeight: number = 0;
    private windowWidth: number = 0;
    //ProgramApiModel のアップデート時に差分更新をするために使用する
    private programCache: { [key: number]: ProgramCacheStructure } = {};

    //ProgramContentView の更新時間を記録する
    public programUpdateTime: Date | null = null;

    //表示されている局数を記憶する
    public stationCnt = 0;

    constructor(
        _programApiModel: ProgramApiModelInterface,
        _programConfigApiModel: ProgramConfigApiModelInterface,
        _liveConfigEnableApiModel: LiveConfigEnableApiModelInterface
    ) {
        super();
        this.programApiModel = _programApiModel;
        this.programConfigApiModel = _programConfigApiModel;
        this.liveConfigEnableApiModel = _liveConfigEnableApiModel;
    }

    /**
    * 初期化
    * ParentPageController から呼ばれる
    */
    public init(status: ControllerStatus): void {
        if(status == "reload") {
            this.resetCache();
            this.showProgress();
            this.updateProgram();
        } else {
            this.stationCnt = 0;
            this.initScrollPosition();
            this.showProgress();
            this.programUpdateTime = null;
            this.programApiModel.init(() => { this.diffUpdate(); });
            this.updateProgram();
            this.programConfigApiModel.update();
            this.initUpdateTime();
            this.headerHeight = 0;
            this.windowWidth = 0;
            this.resetCache();
        }
    }

    //program api model を更新する
    public updateProgram(): void {
        this.programApiModel.update();
    }

    //ProgramApiModel の update 時間を変更する
    public initUpdateTime(): void {
        this.programApiModel.setUpdateTime();
    }

    //ProgramApiModel の update 時刻を返す
    public getUpdateTime(): Date {
        return this.programApiModel.getUpdateTime();
    }

    //プログレスを非表示にする
    public hiddenProgress(): void {
        let progress = document.getElementById(ProgramViewModel.programBusyId);
        let program = document.getElementById(ProgramViewModel.programFrameId);
        if(progress == null || program == null) { return; }
        progress.style.display = "none";
        program.style.display = "";
    }

    //プログレスを表示する
    public showProgress(): void {
        let progress = document.getElementById(ProgramViewModel.programBusyId);
        let program = document.getElementById(ProgramViewModel.programFrameId);
        if(progress == null || program == null) { return; }
        progress.style.display = "block";
        program.style.display = "none";
    }

    //スクロールポジションの初期化
    public initScrollPosition(): void {
        let frame = document.getElementById(ProgramViewModel.programFrameId);
        let stationFrame =  document.getElementById(ProgramViewModel.stationFrameId);
        let timeFrame = document.getElementById(ProgramViewModel.timeFrameId);
        if(frame != null && stationFrame != null && timeFrame != null) {
            frame.scrollLeft = 0;
            frame.scrollTop = 0;
            stationFrame.scrollLeft = 0;
            timeFrame.scrollTop = 0;
        }
    }

    //program cache をリセットする
    public resetCache(): void {
        this.programCache = {};
    }

    /**
    * 指定した id の cache を返す
    * @param id id
    */
    public getCache(id: number): ProgramCacheStructure {
        return this.programCache[id];
    }

    /**
    * program の状態 (予約状態、自動予約状態) とその Element を追加する
    * @param id program id
    * @param obj ProgramCacheStructure
    */
    public addCache(id: number, autorec: number, recorded: boolean, element: Element): void {
        if(typeof this.programCache[id] == "undefined") {
            this.programCache[id] = {
                autorec: autorec,
                recorded: recorded,
                element: [element]
            }
        } else {
            this.programCache[id].element.push(element);
        }
    }

    /**
    * 番組表 DOM 差分更新
    */
    private diffUpdate(): void {
        let programs = this.programApiModel.getProgram();
        if(programs == null) { return; }

        programs.map((stationProgram: { [key: string]: any }[]) => {
            stationProgram.map((program: { [key: string]: any }) => {
                let id = program["id"];

                if(typeof this.programCache[id] == "undefined") { return; }

                this.programCache[id].element.map((element, index) => {
                    //自動予約
                    if(this.programCache[id].autorec != program["autorec"]) {
                        if(program["autorec"] == 0) {
                            element.classList.add(ProgramViewModel.autorecClassStr);
                        } else {
                            element.classList.remove(ProgramViewModel.autorecClassStr);
                        }
                    }

                    //録画予約
                    if(this.programCache[id].recorded != program["recorded"]) {
                        if(program["recorded"]) {
                            element.classList.add(ProgramViewModel.recordedClassStr);
                        } else {
                            element.classList.remove(ProgramViewModel.recordedClassStr);
                        }
                    }

                    //全ての element をに class を追加したら cache の状態を書き換える
                    if(index == this.programCache[id].element.length - 1) {
                        this.programCache[id].autorec = program["autorec"];
                        this.programCache[id].recorded = program["recorded"];
                    }
                });
            });
        });
    }

    /**
    * ライブ配信が有効化返す
    * true: 有効, false: 無効
    */
    public getLiveEnableStatus(): boolean {
        return this.liveConfigEnableApiModel.getHLSLive() || this.liveConfigEnableApiModel.getHttpLive() || this.liveConfigEnableApiModel.getHttpPCLive();
    }

    //window resize 時の処理
    public resize(): void {
        this.headerCheck();
        this.windowWidthCheck();
    }

    //header の高さの変更を監視する
    private headerCheck(): void {
        let newHeaderSize = Util.getHeaderHeight();

        if(newHeaderSize > 0 && this.headerHeight == 0) {
            this.headerHeight = newHeaderSize;
        } else if(newHeaderSize > 0 && newHeaderSize != this.headerHeight) {
            this.headerHeight = newHeaderSize;
            //header の高さの変更を反映させるために再描画
            //m.redraw.strategy("diff");
            m.redraw();
        }
    }

    //window の width が mobile 間で table 切り替わるか監視する
    private windowWidthCheck(): void {
        let newWidth = window.innerWidth;

        if(this.windowWidth == 0) {
            this.windowWidth = newWidth;
            return;
        }

        //mobile -> tablet or table -> mobile
        if( (newWidth > ProgramViewModel.viewConfigWidth && this.windowWidth <= ProgramViewModel.viewConfigWidth)
         || (newWidth <= ProgramViewModel.viewConfigWidth && this.windowWidth > ProgramViewModel.viewConfigWidth) ) {
            this.initUpdateTime();
            //m.redraw.strategy("diff");
            m.redraw();
        }

        this.windowWidth = newWidth;
    }

    //ジャンルを返す
    public getGenres(): { [key: string]: any }[] | null {
        return this.programApiModel.getGenres();
    }

    //サブジャンルを返す
    public getSubGenres(): { [key: number]: { [key:number]: string } } | null {
        return this.programApiModel.getSubGenres();
    }

    //time を返す
    public getTime(): { [key: string]: number } | null {
        return this.programApiModel.getTime();
    }

    //channel を返す
    public getChannel(): { [key: string]: any }[] | null {
        return this.programApiModel.getChannel();
    }

    //program を返す
    public getProgram(): { [key: string]: any }[] | null {
        return this.programApiModel.getProgram();
    }

    //recMode を返す
    public getRecMode(): { [key: string]: any }[] {
        return this.programConfigApiModel.getRecMode();
    }

    //トランスコードプルダウンの開始位置を返す
    public getStartTranscodeId(): number {
        let value = this.programConfigApiModel.getStartTranscodeId();
        return value == null ? -1 : value;
    }

    //録画モードプルダウンの開始位置を返す
    public getRecModeDefaultId(): number {
        let value = this.programConfigApiModel.getRecModeDefaultId();
        return value == null ? -1 : value;
    }

    //タブレット用 view 設定を返す
    public getTabletViewConfig(): { [key: string]: number } | null {
        return this.programConfigApiModel.getTabletViewConfig();
    }

    //モバイル用 view 設定を返す
    public getMobileViewConfig(): { [key: string]: number } | null {
        return this.programConfigApiModel.getMobileViewConfig();
    }

    //window 横幅判断して タブレット or モバイル用の view 設定を返す
    public getViewConfig(): { [key: string]: number } | null {
        if(window.innerWidth > ProgramViewModel.viewConfigWidth) {
            return this.getTabletViewConfig();
        } else {
            return this.getMobileViewConfig();
        }
    }
}

namespace ProgramViewModel {
    export const viewConfigWidth = 600; //table と mobile の境界値
    export const programFrameId = "program_frame";
    export const stationFrameId = "station_frame";
    export const timeFrameId = "time_frame";
    export const recordedClassStr = "tv_program_reced";
    export const autorecClassStr = "tv_program_freeze";
    export const timeDialogId = "program_time";
    export const programBusyId = "program_busy";
}

export default ProgramViewModel;

