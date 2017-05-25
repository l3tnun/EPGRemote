"use strict";

import Controller from '../Controller';
import { ControllerStatus } from '../../Enums';

class NavigationController extends Controller {
    public initModel(status: ControllerStatus): void {
        super.initModel(status);

        this.getModel("NavigationViewModel").init(status);
    }
}

export default NavigationController;

