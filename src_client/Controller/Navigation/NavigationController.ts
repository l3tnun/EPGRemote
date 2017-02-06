"use strict";

import Controller from '../Controller';

class NavigationController extends Controller {
    public initModel(): void {
        this.getModel("NavigationViewModel").init();
    }
}

export default NavigationController;

