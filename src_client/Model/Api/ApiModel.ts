"use strict";

import Model from '../Model';

/**
* /api から JSON を取得、更新するためのクラス
*/
abstract class ApiModel extends Model {
    //json の取得
    public abstract update(...args: any[]): void;
}

export default ApiModel;

