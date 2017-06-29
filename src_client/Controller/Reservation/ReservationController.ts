"use strict";

import ParentPageController from '../ParentPageController';
import ReservationViewModel from '../../ViewModel/Reservation/ReservationViewModel';
import { ControllerStatus } from '../../Enums';

class ReservationController extends ParentPageController {
    private resizeListener = this.resize.bind(this);
    private viewModel: ReservationViewModel;

    //ViewModel 初期化
    public initModel(status: ControllerStatus): void {
        super.initModel(status);

        this.viewModel = <ReservationViewModel>this.getModel("ReservationViewModel");
        this.viewModel.init(status);

        window.addEventListener('resize', this.resizeListener, false );
    }

    public enableSocketIoModules(): void {
        super.enableSocketIoModules();

        this.socketIoManager.enableModule("reservationCancelRec");
        this.socketIoManager.enableModule("reservationOtherEvent");
    }

    //ページから離れるときに呼び出される
    public onRemove(): void {
        super.onRemove();
        window.removeEventListener('resize', this.resizeListener, false );
    }

    private resize(): void {
        setTimeout(() => { this.viewModel.resize(); }, 100);
    }
}

export default ReservationController;

