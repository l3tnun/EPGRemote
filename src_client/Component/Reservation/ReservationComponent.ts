"use strict";

import Component from '../Component';
import ReservationController from '../../Controller/Reservation/ReservationController';
import ReservationView from '../../View/Reservation/ReservationView';

class ReservationComponent extends Component {
    protected getController() {
        return new ReservationController();
    }

    protected getView() {
        return new ReservationView();
    }

    protected getModels() {
        return {
            DialogViewModel: this.container.get("DialogViewModel"),
            ReservationViewModel: this.container.get("ReservationViewModel"),
            PaginationViewModel: this.container.get("PaginationViewModel"),
            ReservationDeleteDialogContentViewModel: this.container.get("ReservationDeleteDialogContentViewModel"),
            MenuViewModel: this.container.get("MenuViewModel"),
            ReservationMenuViewModel: this.container.get("ReservationMenuViewModel")
        };
    }
}

export default ReservationComponent;

