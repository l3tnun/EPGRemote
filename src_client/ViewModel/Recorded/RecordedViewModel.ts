"use strict";

import * as m from 'mithril';
import ViewModel from '../ViewModel';
import { RecordedApiModelParamsInterface, RecordedApiModelInterface} from '../../Model/Api/Recorded/RecordedApiModel';

/**
* Recorded ViewModel
*/

class RecordedViewModel extends ViewModel {
    private recordedApiModel: RecordedApiModelInterface;
    private options: RecordedApiModelParamsInterface = {};
    private showStatus: boolean | null = null; //true: カードリスト表示, false: カードタイル表示

    constructor(_recordedApiModel: RecordedApiModelInterface) {
        super();
        this.recordedApiModel = _recordedApiModel;
    }

    /**
    * パラメータ設定
    * @param options RecordedApiModelParamsInterface の形式で渡す
    */
    public setup(options: RecordedApiModelParamsInterface): void {
        this.options = options;
    }

    //更新
    public update(): void {
        this.recordedApiModel.setup(this.options);
        this.recordedApiModel.update();
    }

    public getRecordedList(): any[] {
        return this.recordedApiModel.getRecordedList();
    }

    public getRecordedTotalNum(): number {
        let value = this.recordedApiModel.getRecordedTotalNum();
        return value == null ? 0 : value;
    }

    public getRecordedLimit(): number {
        let value = this.recordedApiModel.getRecordedLimit();
        return value == null ? 0 : value;
    }

    //window resize 時の処理
    public resize(): void {
         if((this.showStatus || this.showStatus == null) && window.innerWidth >= RecordedViewModel.cardWidth * 2) {
            this.showStatus = false;
            m.redraw(true);
            return;
        } else if((!this.showStatus || this.showStatus == null) && window.innerWidth < RecordedViewModel.cardWidth * 2) {
            this.showStatus = true;
            m.redraw(true);
            return;
        }

        //カードタイル描画のため
        if(!this.showStatus) { m.redraw(true); }
    }

    /**
    * 表示状態
    * null: 決まってない, true: カードリスト, false: カードタイル
    */
    public getShowStatus(): boolean | null {
        return this.showStatus;
    }
}

namespace RecordedViewModel {
    export const cardWidth = 308;
}

export default RecordedViewModel;

