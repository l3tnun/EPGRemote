"use strict";

import Util from '../Util/Util';
import MithrilBase from '../MithrilBase';

/**
* Controller 抽象クラス
* Mithril の Controller 部分
*/
abstract class Controller extends MithrilBase {
    private query: { [key: string]: any } = {}
    private newQuery: { [key: string]: any } = {}
    private queryChanged: boolean = false;

    /**
    * oninit
    */
    public onInit(): void {
        this.query = Util.getCopyQuery();
        this.queryChanged = false;
        this.initModel();
    }

    /**
    * onbeforeupdate
    */
    public onBeforeUpdate(): void {
        this.newQuery = Util.getCopyQuery();
        if(Util.buildQueryStr(this.newQuery) == Util.buildQueryStr(this.query)) { return; }
        this.queryChanged = true;
        this.onRemove();
    }

    /**
    * onupdate
    */
    public onUpdate(): void {
        if(this.queryChanged) { this.initModel(); }
        this.query = this.newQuery;
    }

    /**
    * onremove
    * 同じページでも query が異なると呼ばれる
    */
    public onRemove(): void {}

    /**
    * 使用する Model を初期化する
    * 同じページでも query が異なると呼ばれる
    */
    protected initModel(): void {}
}

export default Controller;

