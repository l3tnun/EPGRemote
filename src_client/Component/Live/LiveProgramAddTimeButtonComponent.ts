"use strict";

import Component from '../Component';
import LiveProgramAddTimeButtonView from '../../View/Live/LiveProgramAddTimeButtonView';

/**
* LiveProgramAddTimeButton Component
*/
class LiveProgramAddTimeButtonComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new LiveProgramAddTimeButtonView();
    }

    protected getModels() {
        return {
            LiveProgramCardViewModel: this.container.get("LiveProgramCardViewModel")
        }
    }
}

export default LiveProgramAddTimeButtonComponent;

