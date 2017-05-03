"use strict";

import EpgrecModuleModel from './EpgrecModuleModel';
import { KeywordApiModelInterface } from '../Keyword/KeywordApiModel';

interface DeleteKeywordEpgrecModuleModelInterface extends EpgrecModuleModel {
    execute(keyword_id: number): void;
    viewUpdate(value: { [key: string]: any; }): void;
}

/**
* epgrec のキーワード削除を行う
*/
class DeleteKeywordEpgrecModuleModel extends EpgrecModuleModel implements DeleteKeywordEpgrecModuleModelInterface {
    private keywordApiModel: KeywordApiModelInterface;

    constructor(_keywordApiModel: KeywordApiModelInterface) {
        super();
        this.keywordApiModel = _keywordApiModel;
    }

    /**
    * キーワード削除
    * @param keyword_id keword_id
    */
    public execute(keyword_id: number): void {
        this.getRequest({
            method: "DELETE",
            url: `/api/keyword?keyword_id=${ keyword_id }`
        },
        null,
        "DeleteKeywordEpgrecModuleModel error.");
    }

    public viewUpdate(value: { [key: string]: any; }): void {
        super.viewUpdate(value);
        let keyword_id = Number(value["keyword_id"]);
        let keyword: { [key: string]: any } | null = null;

        this.keywordApiModel.getKeywords().map((data: { [key: string]: any }) => {
            if(data["id"] == keyword_id) {
                keyword = data;
            }
        });
        if(keyword == null) { return; }

        let snackbarStr = "";
        if(value["status"] == "error") {
            snackbarStr = "キーワード削除失敗 " + value["messeage"] + " " + keyword["keyword"];
        } else {
            snackbarStr = "キーワード削除 " + keyword["keyword"];
            this.keywordApiModel.update();
        }

        this.dialog.close();
        this.snackbar.open(snackbarStr);
    }
}

export { DeleteKeywordEpgrecModuleModel, DeleteKeywordEpgrecModuleModelInterface };

