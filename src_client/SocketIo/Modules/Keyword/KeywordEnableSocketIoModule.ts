"use strict";

import * as m from 'mithril';
import SocketIoModule from '../SocketIoModule';
import { EnableKeywordEpgrecModuleModelInterface } from '../../../Model/Api/EpgrecModule/EnableKeywordEpgrecModuleModel';

/*
* 自動録画キーワードが有効化、無効化されると呼ばれる
*/
class KeywordEnableSocketIoModule extends SocketIoModule {
    private enableKeywordEpgrecModule: EnableKeywordEpgrecModuleModelInterface;

    constructor(_enableKeywordEpgrecModule: EnableKeywordEpgrecModuleModelInterface) {
        super();
        this.enableKeywordEpgrecModule = _enableKeywordEpgrecModule;
    }

    public getName(): string { return "keywordEnable"; }

    public getEventName(): string[] {
        return [
            "keywordEnable"
        ];
    }

    public execute(option: { [key: string]: any; }): void {
        this.enableKeywordEpgrecModule.viewUpdate(option);
    }
}

export default KeywordEnableSocketIoModule;

