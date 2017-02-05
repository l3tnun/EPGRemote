"use strict";

import * as m from 'mithril';
import ViewModel from '../ViewModel';
import Util from  '../../Util/Util';

/**
* Pagination の ViewModel
*/
class PaginationViewModel extends ViewModel {
    private _next: { [key: string]: any } | null = null;
    private _prev: { [key: string]: any } | null = null;
    private _names: string = ""; //name だと実行時に TypeError が発生する
    private _showStatus: boolean = false;

    /**
    * 初期化
    * ParentPageController からページ読み込み時に呼ばれる
    */
    public init(): void {
        this._next = null;
        this._prev = null;
        this._names = "";
        this._showStatus = false
    }

    /**
    * Pagination の設定
    * @param 1ページで表示するコンテンツの個数
    * @param 表示するコンテンツの全体の個数
    */
    public setup(_limit: number, totalNum: number): void {
        let url = Util.getRoute();
        let query = Util.getCopyQuery();
        let page: number;
        let limit: number;

        page = (typeof query["page"] == "undefined") ? 1 : Number(query["page"]);
        limit = (typeof query["limit"] == "undefined") ? _limit : Number(query["limit"]);

        let prev: { [key: string]: any } = { url: url, query: Util.getCopyQuery() };
        let next: { [key: string]: any } = { url: url, query: Util.getCopyQuery() };

        prev["query"]["page"] = page - 1;
        next["query"]["page"] = page + 1;

        //1ページで収まる場合は pagination を表示させない
        this._showStatus = !(page == 1 && page * limit >= totalNum || limit == null)

        if( page * limit >= totalNum ) { next = { url: null, query: null }; }

        if(page <= 1) {
            prev = { url: null, query: null }
            this._names = "次のページ"
        } else {
            this._names = `ページ${ page }`
        }

        if(next["url"] == null) { this._next = null; }
        else { this._next = { addr: next["url"], query: next["query"] }; }
        if(prev["url"] == null) { this._prev = null; }
        else { this._prev = { addr: prev["url"], query: prev["query"] }; }
    }

    //getter
    get next(): { [key: string]: any } | null {
        return this._next;
    }

    get prev(): { [key: string]: any } | null {
        return this._prev;
    }

    get name(): string {
        return this._names;
    }

    get showStatus(): boolean {
        return this._showStatus;
    }
}

export default PaginationViewModel;

