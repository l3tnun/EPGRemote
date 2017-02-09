"use strict";

import * as m from 'mithril';
import ViewModel from '../ViewModel';
import Util from '../../Util/Util';
import { ReservationApiModelInterface } from '../../Model/Api/Reservation/ReservationApiModel';

/**
* Reservation の ViewModel
*/
class ReservationViewModel extends ViewModel {
    private reservationApiModel: ReservationApiModelInterface;
    private page: number | null = null;
    private limit: number | null = null;
    private showStatus: boolean | null = null; //true: カード表示, false: 表表示

    constructor(_reservationApiModel: ReservationApiModelInterface) {
        super();

        this.reservationApiModel = _reservationApiModel;
    }

    /**
    * 初期化
    * controller からページ読み込み時に呼ばれる
    */
    public init(): void {
        this.showStatus = null;
        let query = Util.getCopyQuery();
        this.page = (typeof query["page"] == "undefined") ? null : Number(query["page"]);
        this.limit = (typeof query["limit"] == "undefined") ? null : Number(query["limit"]);
        this.reservationApiModel.init();
    }

    //更新
    public update(): void {
        this.reservationApiModel.setup(this.page, this.limit);
        this.reservationApiModel.update();
    }

    //programs を返す
    public getPrograms(): { [key: string]: any }[] {
        return this.reservationApiModel.getPrograms();
    }

    //limit を返す
    public getProgramLimit(): number {
        let value = this.reservationApiModel.getProgramLimit();
        return value == null ? 0 : value;
    }

    //totalNum を返す
    public getProgramTotalNum(): number {
        return this.reservationApiModel.getProgramTotalNum();
    }

    //window resize 時の処理
    public resize(): void {
        if((!this.showStatus || this.showStatus == null) && window.innerWidth < ReservationViewModel.viewChangeWidth) {
            this.showStatus = true;
            m.redraw();
        } else if((this.showStatus || this.showStatus == null) && window.innerWidth > ReservationViewModel.viewChangeWidth) {
            this.showStatus = false;
            m.redraw();
        }
    }

    /**
    * 表示状態
    * null: 決まってない, true: カード, false: 表
    */
    public getShowStatus(): boolean | null {
        return this.showStatus;
    }
}

namespace ReservationViewModel {
    export const viewChangeWidth = 680;
}

export default ReservationViewModel;

