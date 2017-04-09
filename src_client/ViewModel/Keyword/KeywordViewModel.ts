"use strict";

import * as m from 'mithril';
import ViewModel from '../ViewModel';
import Util from '../../Util/Util';
import { KeywordApiModelInterface } from '../../Model/Api/Keyword/KeywordApiModel';
import { EnableKeywordEpgrecModuleModelInterface } from '../../Model/Api/EpgrecModule/EnableKeywordEpgrecModuleModel';

/**
* Keyword の ViewModel
*/
class KeywordViewModel extends ViewModel {
    private keywordApiModel: KeywordApiModelInterface;
    private enableKeywordEpgrecModuleModel: EnableKeywordEpgrecModuleModelInterface;
    private page: number | null = null;
    private limit: number | null = null;
    private showStatus: boolean | null = null; //true: カード表示, false: 表表示

    constructor(_keywordApiModel: KeywordApiModelInterface, _enableKeywordEpgrecModuleModel: EnableKeywordEpgrecModuleModelInterface) {
        super();
        this.keywordApiModel = _keywordApiModel;
        this.enableKeywordEpgrecModuleModel = _enableKeywordEpgrecModuleModel;
    }

    /**
    * 初期化
    * controller からページ読み込み時に呼ばれる
    */
    public init(): void {
        this.keywordApiModel.init();
        this.showStatus = null;
        let query = Util.getCopyQuery();
        this.page = (typeof query["page"] == "undefined") ? null : Number(query["page"]);
        this.limit = (typeof query["limit"] == "undefined") ? null : Number(query["limit"]);

        setTimeout(() => { this.update(); }, 200);
    }

    //model の更新
    public update(): void {
        this.keywordApiModel.setup(this.page, this.limit);
        this.keywordApiModel.update();
    }

    //keywords を返す
    public getKeywords(): { [key: string]: any }[] {
        return this.keywordApiModel.getKeywords();
    }

    //limit を返す
    public getKeywordLimit(): number {
        return this.keywordApiModel.getKeywordLimit();
    }

    //totalNum を返す
    public  getKeywordTotalNum(): number {
        return this.keywordApiModel.getKeywordTotalNum();
    }

    //window resize 時の処理
    public resize(): void {
        if((!this.showStatus || this.showStatus == null) && window.innerWidth < KeywordViewModel.viewChangeWidth) {
            this.showStatus = true;
            m.redraw();
        } else if((this.showStatus || this.showStatus == null) && window.innerWidth > KeywordViewModel.viewChangeWidth) {
            this.showStatus = false;
            m.redraw();
        }
    }

    /**
    * 表示状態
    * null: 決まってない, true: カード, false: 表
    */
    public getShowStatus(): boolean | null {
        return this.showStatus;
    }

    /**
    * キーワードの有効化
    * @param keyword_id keword_id
    * @param status true: 有効化, false: 無効化
    */
    public enableKeyword(keyword_id: number, status: boolean): void {
        this.enableKeywordEpgrecModuleModel.execute(keyword_id, status);
    }
}

namespace KeywordViewModel {
    export const viewChangeWidth = 800;
}

export default KeywordViewModel;

