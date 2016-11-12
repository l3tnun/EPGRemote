"use strict";

import ViewModel from '../ViewModel';

/**
* Reservation の ViewModel
*/
class ReservationMenuViewModel extends ViewModel {
    public program: { [key: string]: any } | null = null;
}

namespace ReservationMenuViewModel {
    export const id = "menu-list";
}

export default ReservationMenuViewModel;

