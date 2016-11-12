"use strict";

import MithrilBase from '../MithrilBase';

/**
* Controller 抽象クラス
* Mithril の Controller 部分
*/
abstract class Controller extends MithrilBase {
    public execute(): any {
        this.initModel();
        return null;
    }

    //使用する Model を初期化する
    protected initModel(): void {}
}

export default Controller;

