"use strict";

import ParentPageController from '../ParentPageController';
import ReservationViewModel from '../../ViewModel/Reservation/ReservationViewModel';

class ReservationController extends ParentPageController {
    private resizeListener = this.resize.bind(this);
    private viewModel: ReservationViewModel;

    //ViewModel 初期化
    public initModel(): void {
        this.viewModel = <ReservationViewModel>this.getModel("ReservationViewModel");
        this.viewModel.init();
        this.viewModel.update();

        window.addEventListener('resize', this.resizeListener, false );
    }

    public enableSocketIoModules(): void {
        super.enableSocketIoModules();

        this.socketIoManager.enableModule("reservationCancelRec");
        this.socketIoManager.enableModule("reservationOtherEvent");
    }

    //ページから離れるときに呼び出される
    public onunload(): void {
        super.onunload();
        window.removeEventListener('resize', this.resizeListener, false );
    }

    private resize(): void {
        this.viewModel.resize();
    }
}

export default ReservationController;

