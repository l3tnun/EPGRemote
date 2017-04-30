"use strict";

import RequestModel from '../RequestModel';

/**
* /api から JSON を取得、更新するためのクラス
*/
abstract class ApiModel extends RequestModel {
    //json の取得
    public abstract update(...args: any[]): void;
}

export default ApiModel;

