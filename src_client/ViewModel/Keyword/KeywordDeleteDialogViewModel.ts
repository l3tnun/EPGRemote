"use strict";

import ViewModel from '../ViewModel';
import { DeleteKeywordEpgrecModuleModelInterface } from '../../Model/Api/EpgrecModule/DeleteKeywordEpgrecModuleModel';

/**
* KeywordDeleteDialog の ViewModel
*/
class KeywordDeleteDialogViewModel extends ViewModel {
    private deleteKeywordEpgrecModuleModel: DeleteKeywordEpgrecModuleModelInterface;
    private keyword: { [ley: string]: any } | null = null;

    constructor(_deleteKeywordEpgrecModuleModel: DeleteKeywordEpgrecModuleModelInterface) {
        super();
        this.deleteKeywordEpgrecModuleModel = _deleteKeywordEpgrecModuleModel;
    }

    public setup(_KeywordDeleteDialogViewModel: { [ley: string]: any }): void {
        this.keyword = _KeywordDeleteDialogViewModel;
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

namespace KeywordDeleteDialogViewModel {
    export const dialogId = "keyword_delete_dialog";
}

export default KeywordDeleteDialogViewModel;

