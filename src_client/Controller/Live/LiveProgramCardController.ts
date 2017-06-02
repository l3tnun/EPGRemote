"use strict";

import Controller from '../Controller';
import { ControllerStatus } from '../../Enums';

class LiveProgramCardController extends Controller {
    protected initModel(status: ControllerStatus): void {
        super.initModel(status);

        this.getModel("LiveProgramCardViewModel").init(status);
    }
}

export default LiveProgramCardController;

