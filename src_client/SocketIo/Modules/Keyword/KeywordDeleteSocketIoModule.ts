"use strict";

import SocketIoModule from '../SocketIoModule';
import { DeleteKeywordEpgrecModuleModelInterface } from '../../../Model/Api/EpgrecModule/DeleteKeywordEpgrecModuleModel';

/*
* 自動録画キーワードが有効化、無効化されると呼ばれる
*/
class KeywordDeleteSocketIoModule extends SocketIoModule {
    private deleteKeywordEpgrecModule: DeleteKeywordEpgrecModuleModelInterface;

    public getName(): string { return "keywordDelete"; }

    public getEventName(): string[] {
        return [
            "keywordDelete"
        ];
    }

    constructor(_deleteKeywordEpgrecModule: DeleteKeywordEpgrecModuleModelInterface) {
        super();
        this.deleteKeywordEpgrecModule = _deleteKeywordEpgrecModule;
    }

    public execute(option: { [key: string]: any; }): void {
        this.deleteKeywordEpgrecModule.viewUpdate(option);
    }
}

export default KeywordDeleteSocketIoModule;

