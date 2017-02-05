"use strict";

import * as m from 'mithril';
import SocketIoModule from '../SocketIoModule';
import { KeywordApiModelInterface } from '../../../Model/Api/Keyword/KeywordApiModel';

/*
* 自動録画キーワードが追加、更新されると呼ばれる
*/
class KeywordAddSocketIoModule extends SocketIoModule {
    private keywordApiModel: KeywordApiModelInterface;

    constructor(_keywordApiModel: KeywordApiModelInterface) {
        super();
        this.keywordApiModel = _keywordApiModel;
    }

    public getName(): string { return "keywordAdd"; }

    public getEventName(): string[] {
        return [
            "keywordAdd"
        ];
    }

    public execute(_option: { [key: string]: any; }): void {
        this.keywordApiModel.update();
    }
}

export default KeywordAddSocketIoModule;

