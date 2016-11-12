"use strict";

import SocketIoModule from '../SocketIoModule';
import { SimpleRecEpgrecModuleModelInterface } from '../../../Model/Api/EpgrecModule/SimpleRecEpgrecModuleModel';

/*
* 簡易予約が実行されると呼ばれる
*/
class ProgramSimpleRecSocketIoModule extends SocketIoModule {
    private simpleRecEpgrecModuleModel: SimpleRecEpgrecModuleModelInterface;

    public getName(): string { return "programSimpleRec"; }

    public getEventName(): string[] {
        return [
            "programSimpleRec"
        ];
    }

    constructor(_simpleRecEpgrecModuleModel: SimpleRecEpgrecModuleModelInterface) {
        super();
        this.simpleRecEpgrecModuleModel = _simpleRecEpgrecModuleModel;
    }

    public execute(option: { [key: string]: any; }): void {
        this.simpleRecEpgrecModuleModel.viewUpdate(option);
    }
}

export default ProgramSimpleRecSocketIoModule;

