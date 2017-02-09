"use strict";

import * as m from 'mithril';
import EpgrecModuleModel from './EpgrecModuleModel';
import { KeywordApiModelInterface } from '../Keyword/KeywordApiModel';

interface EnableKeywordEpgrecModuleModelInterface extends EpgrecModuleModel {
    execute(keyword_id: number, status: boolean): void;
    viewUpdate(value: { [key: string]: any; }): void;
}

/**
* epgrec のキーワードの無効化、有効化を行う
*/
class EnableKeywordEpgrecModuleModel extends EpgrecModuleModel implements EnableKeywordEpgrecModuleModelInterface {
    private keywordApiModel: KeywordApiModelInterface;

    constructor(_keywordApiModel: KeywordApiModelInterface) {
        super();
        this.keywordApiModel = _keywordApiModel;
    }

    /**
    * キーワード有効化
    * @param keyword_id keword_id
    * @param status true: 有効化, false: 無効化
    */
    public execute(keyword_id: number, status: boolean): void {
        let query = {
            keyword_id: keyword_id,
            status: status ? 1 : 0
        };

        m.request({
            method: "PUT",
            url: `/api/keyword`,
            data: m.buildQueryString(query)
        })
        .then((_value) => {
            //this.viewUpdate(_value);
        },
        (error) => {
            console.log("EnableKeywordEpgrecModuleModel error.");
            console.log(error);
        });
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

        let statusStr = value["enable"] ? "有効化" : "無効化";;
        let snackbarStr = "";
        if(value["status"] == "error") {
            snackbarStr = `キーワード${ statusStr }失敗 ${ keyword["keyword"] }`;
        } else {
            snackbarStr = `キーワード${ statusStr } ${ keyword["keyword"] }`;
        }

        this.keywordApiModel.update();
        this.dialog.close();
        this.snackbar.open(snackbarStr);
    }
}

export { EnableKeywordEpgrecModuleModel, EnableKeywordEpgrecModuleModelInterface };

