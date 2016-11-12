"use strict";

import Component from '../Component';
import ReservationDeleteDialogContentView from '../../View/Reservation/ReservationDeleteDialogContentView';

class ReservationDeleteDialogContentComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new ReservationDeleteDialogContentView();
    }

    protected getModels() {
        return {
            ReservationDeleteDialogContentViewModel: this.container.get("ReservationDeleteDialogContentViewModel"),
            ReservationViewModel: this.container.get("ReservationViewModel"),
            DialogViewModel: this.container.get("DialogViewModel"),
        };
    }
}

export default ReservationDeleteDialogContentComponent;

