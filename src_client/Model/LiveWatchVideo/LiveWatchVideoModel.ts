"use strict";

import Model from '../Model';

interface LiveWatchVideoModelInterface extends Model {
    init(): void;
    show(): void;
    get(): boolean;
}

/**
* LiveWatchVideoModel
* video の表示状態を管理する
*/
class LiveWatchVideoModel implements LiveWatchVideoModelInterface {
    //video の表示状態 true: 表示ok, false: 表示準備中
    private showStatus: boolean = false;

    public init(): void {
        this.showStatus = false;
    }

    public show(): void {
        this.showStatus = true;

        //描画更新
        //m.redraw.strategy("diff");
        m.redraw();
    }

    public get(): boolean {
        return this.showStatus;
    }
}

export { LiveWatchVideoModelInterface, LiveWatchVideoModel }

