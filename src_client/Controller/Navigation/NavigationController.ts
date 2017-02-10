"use strict";

import Controller from '../Controller';

class NavigationController extends Controller {
    public initModel(): void {
        super.initModel();

        this.getModel("NavigationViewModel").init();
    }
}

export default NavigationController;

