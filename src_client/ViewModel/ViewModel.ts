"use strict";

/**
* ViewModel 抽象クラス
* Controller, View から呼び出されて使用される
* Component クラスで Model がセットされる
*/
abstract class ViewModel {
    /**
    * 初期化処理(model 等)
    * override して使用する
    */
    public init(): void {}
}

export default ViewModel;

