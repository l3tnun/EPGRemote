"use strict";

import ViewModel from '../ViewModel';
import { DeleteKeywordEpgrecModuleModelInterface } from '../../Model/Api/EpgrecModule/DeleteKeywordEpgrecModuleModel';

/**
* KeywordInfoDialog の ViewModel
*/
class KeywordInfoDialogViewModel extends ViewModel {
    private deleteKeywordEpgrecModuleModel: DeleteKeywordEpgrecModuleModelInterface;
    private keyword: { [ley: string]: any } | null = null;

    constructor(_deleteKeywordEpgrecModuleModel: DeleteKeywordEpgrecModuleModelInterface) {
        super();
        this.deleteKeywordEpgrecModuleModel = _deleteKeywordEpgrecModuleModel;
    }

    public setup(_KeywordInfoDialogViewModel: { [ley: string]: any }): void {
        this.keyword = _KeywordInfoDialogViewModel;
    }

    public getKeyword(): { [ley: string]: any } | null {
        return this.keyword;
    }

    //keyword 削除
    public deleteKeyword(): void {
        if(this.keyword == null) { return; }
        this.deleteKeywordEpgrecModuleModel.execute(this.keyword["id"]);
    }
}

namespace KeywordInfoDialogViewModel {
    export const dialogId = "keyword_info_dialog";
}

export default KeywordInfoDialogViewModel;

