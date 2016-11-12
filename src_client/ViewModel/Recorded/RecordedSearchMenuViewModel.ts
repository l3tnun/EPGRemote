"use strict";

import ViewModel from '../ViewModel';
import Util from '../../Util/Util';
import { RecordedSearchConfigApiModelInterface } from '../../Model/Api/Recorded/RecordedSearchConfigApiModel';
import { RecordedSearchConfigQueryInterface } from '../../Model/Api/Recorded/RecordedSearchConfigApiModel';

/**
* RecordedSearchMenu の ViewModel
*/
class RecordedSearchMenuViewModel extends ViewModel {
    private configApiModel: RecordedSearchConfigApiModelInterface;
    private showStatus: boolean = false; //true: 表示, false 非表示
    private _keyword_id: number | null;
    private _category_id: number | null;
    private _channel_id: number | null;
    private _search: string | null;

    constructor(_configApiModel: RecordedSearchConfigApiModelInterface) {
        super();
        this.configApiModel = _configApiModel;
    }

    //ParentPageController から呼ばれる
    public init(): void {
        this.showStatus = false;
    }

    //selector で使う各値をリセット
    public resetQuery(): void {
        let query = Util.getCopyQuery();

        this._keyword_id = typeof query["keyword_id"] == "undefined" ? null: Number(query["keyword_id"]);
        this._category_id = typeof query["category_id"] == "undefined" ? null: Number(query["category_id"]);
        this._channel_id = typeof query["channel_id"] == "undefined" ? null: Number(query["channel_id"]);
        this._search = typeof query["search"] == "undefined" ? null: query["search"];

        //update
        this.keywordUpdate();
        this.categoryUpdate();
        this.channelUpdate();
    }

    /**
    * 表示状態を返す
    * true: 表示, false: 非表示
    */
    public getShowStatus(): boolean {
        return this.showStatus;
    }

    //表示状態を現在と逆にする
    public changeShowStatus(): void {
        this.showStatus = !this.showStatus;

        //表示されるとき各 query をリセットする
        if(this.showStatus) { this.resetQuery(); }
    }

    //keyword update
    public keywordUpdate(): void {
        this.configApiModel.keywordUpdate();
    }

    //category update
    public categoryUpdate(): void {
        this.configApiModel.categoryUpdate(this.createQuery());
    }

    //channel update
    public channelUpdate(): void {
        this.configApiModel.channelUpdate(this.createQuery());
    }

    //keyword を返す
    public getKeyword(): { [key: string]: any }[] {
        return this.configApiModel.getKeyword();
    }

    //category を返す
    public getCategory(): { [key: string]: any }[] {
        return this.configApiModel.getCategory();
    }

    //channel を返す
    public getChannel(): { [key: string]: any }[] {
        return this.configApiModel.getChannel();
    }

    //検索用の query を生成する
    public createQuery(): RecordedSearchConfigQueryInterface {
        let query: RecordedSearchConfigQueryInterface = {};

        if(this._keyword_id != null) { query.keyword_id = this._keyword_id; }
        if(this._category_id != null) { query.category_id = this._category_id; }
        if(this._channel_id != null) { query.channel_id = this._channel_id; }
        if(this._search != null) { query.search = this._search; }

        return query;
    }

    //keyword_id setter getter
    get keyword_id(): number { return this._keyword_id == null ? -1 : this._keyword_id; }
    set keyword_id(value: number) { this._keyword_id = value == -1 ? null : value; }

    //category_id setter getter
    get category_id(): number { return this._category_id == null ? -1 : this._category_id; }
    set category_id(value: number) { this._category_id = value == -1 ? null : value; }

    //channel_id setter getter
    get channel_id(): number { return this._channel_id == null ? -1 : this._channel_id; }
    set channel_id(value: number) { this._channel_id = value == -1 ? null : value; }

    //search setter getter
    get search(): string { return this._search == null ? "" : this._search; }
    set search(value: string) { this._search = value == "" ? null : value; }
}

export default RecordedSearchMenuViewModel;

