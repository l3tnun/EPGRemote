"use strict";

import ViewModel from '../ViewModel';
import { LiveProgramApiModelInterface } from '../../Model/Api/Live/LiveProgramApiModel';
import { ControllerStatus } from '../../Enums';

/**
* LiveProgramCard の ViewModel
*/
class LiveProgramCardViewModel extends ViewModel {
    private liveProgramApiModel: LiveProgramApiModelInterface;
    private time: number = 0;

    constructor(_liveProgram: LiveProgramApiModelInterface) {
        super();

        this.liveProgramApiModel = _liveProgram;
    }

    public init(status: ControllerStatus): void {
        if(status == "reload") { return; }
        this.liveProgramApiModel.init();
    }

    /**
    * 番組一覧を設定後、更新する
    * @param type 放送波
    * @param time 時刻(分)
    */
    public setup(type: string, time: number = 0): void {
        this.time = time;
        this.liveProgramApiModel.setType(type);
        this.liveProgramApiModel.setTime(this.time);
        this.liveProgramApiModel.update();
    }

    /**
    * 時間を加算して更新する
    * @param time 加算する時間
    */
    public addTimeUpdate(time: number): void {
        this.time += time;
        this.liveProgramApiModel.setTime(this.time);
        this.liveProgramApiModel.update();
    }

    /**
    * 時間をリセットして更新する
    */
    public resetTimeUpdate(): void {
        this.time = 0;
        this.liveProgramApiModel.setTime(this.time);
        this.liveProgramApiModel.update();
    }

    // 番組一覧の取得
    public getList(): { [key: string]: any }[] {
        return this.liveProgramApiModel.getList();
    }
}

namespace LiveProgramCardViewModel {
    export const dialogId = "live_program";
    export const cardParentId = "live-program-card-parent";
}

export default LiveProgramCardViewModel;

