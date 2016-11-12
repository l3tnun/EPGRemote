"use strict";

import ViewModel from '../ViewModel';
import { CancelRecEpgrecModuleModelInterface } from '../../Model/Api/EpgrecModule/CancelRecEpgrecModuleModel';
import { AutoRecEpgrecModuleModelInterface } from '../../Model/Api/EpgrecModule/AutoRecEpgrecModuleModel';
import { SimpleRecEpgrecModuleModelInterface } from '../../Model/Api/EpgrecModule/SimpleRecEpgrecModuleModel';
import { CustomRecEpgrecModuleModelInterface } from '../../Model/Api/EpgrecModule/CustomRecEpgrecModuleModel';

/**
* ProgramInfoDialog の ViewModel
*/

class ProgramInfoDialogViewModel extends ViewModel {
    private cancelRecEpgrecModuleModel: CancelRecEpgrecModuleModelInterface;
    private autoRecEpgrecModuleModel: AutoRecEpgrecModuleModelInterface;
    private simpleRecEpgrecModuleModel: SimpleRecEpgrecModuleModelInterface;
    private customRecEpgrecModuleModel: CustomRecEpgrecModuleModelInterface;
    private program: { [key: string]: any } = {};
    private channel: { [key: string]: any } = {};
    private recModeList: { [key: string]: any }[] = [];
    private recModeDefaultId: number = -1;
    public priority: number;
    public deleteFile: boolean;
    public discontinuity: boolean;
    public recMode: number;

    constructor(
        _cancelRecEpgrecModuleModel: CancelRecEpgrecModuleModelInterface,
        _autoRecEpgrecModuleModel: AutoRecEpgrecModuleModelInterface,
        _simpleRecEpgrecModuleModel: SimpleRecEpgrecModuleModelInterface,
        _customRecEpgrecModuleModel: CustomRecEpgrecModuleModelInterface
    ) {
        super();
        this.cancelRecEpgrecModuleModel = _cancelRecEpgrecModuleModel;
        this.autoRecEpgrecModuleModel = _autoRecEpgrecModuleModel;
        this.simpleRecEpgrecModuleModel = _simpleRecEpgrecModuleModel;
        this.customRecEpgrecModuleModel = _customRecEpgrecModuleModel;
    }
    public init(): void {
        this.priority = 10;
        this.deleteFile = false;
        this.discontinuity = false;
        this.recMode = this.getRecModeDefaultId();
    }

    public setProgram(
        _program: { [key: string]: any },
        _channel: { [key: string]: any },
        _recModeList: { [key: string]: any }[],
        _recModeDefaultId: number
    ): void {
        this.program = _program;
        this.channel = _channel;
        this.recModeList = _recModeList;
        this.recModeDefaultId = _recModeDefaultId;
        this.init();
    }

    public getProgram(): { [key: string]: any } {
        return this.program;
    }

    public getChannel(): { [key: string]: any } {
        return this.channel;
    }

    public getRecModeList(): { [key: string]: any }[] {
        return this.recModeList;
    }

    public getRecModeDefaultId(): number {
        return this.recModeDefaultId;
    }

    //予約キャンセル
    public cancelRec(): void {
        this.cancelRecEpgrecModuleModel.execute(this.program["id"]);
    }

    //自動予約許可 or キャンセル
    public changeAutoRec(): void {
        this.autoRecEpgrecModuleModel.execute(this.program["id"], this.program["autorec"] ? true : false);
    }

    //簡易予約
    public simpleRec(): void {
        this.simpleRecEpgrecModuleModel.execute(this.program["id"]);
    }

    //詳細予約
    public customRec(): void {
        this.customRecEpgrecModuleModel.execute(this.program, this.priority, this.deleteFile, this.discontinuity, this.recMode);
    }
}

namespace ProgramInfoDialogViewModel {
    export const infoDialogId = "program_info";
}

export default ProgramInfoDialogViewModel;

