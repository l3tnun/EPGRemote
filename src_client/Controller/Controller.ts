"use strict";

import MithrilBase from '../MithrilBase';

/**
* Controller 抽象クラス
* Mithril の Controller 部分
*/
abstract class Controller extends MithrilBase {
    private query: { [key: string]: any } = {}

    public onInit(): void { this.initModel(); }

    public onUpdate(): void {}

    public onRemove(): void {}

    //使用する Model を初期化する
    protected initModel(): void {}
}

export default Controller;

