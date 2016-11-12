"use strict";

import Component from '../Component';
import ReservationMenuContentView from '../../View/Reservation/ReservationMenuContentView';

class ReservationMenuContentComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new ReservationMenuContentView();
    }

    protected getModels() {
        return {
            ReservationMenuViewModel: this.container.get("ReservationMenuViewModel"),
            MenuViewModel: this.container.get("MenuViewModel"),
            DialogViewModel: this.container.get("DialogViewModel"),
            ReservationDeleteDialogContentViewModel: this.container.get("ReservationDeleteDialogContentViewModel")
        };
    }
}

export default ReservationMenuContentComponent;

