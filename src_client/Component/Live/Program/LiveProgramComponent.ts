"use strict";

import Component from '../../Component';
import LiveProgramController from '../../../Controller/Live/Program/LiveProgramController';
import LiveProgramView from '../../../View/Live/Program/LiveProgramView';

class LiveProgramComponent extends Component {
    protected getController() {
        return new LiveProgramController();
    }

    protected getView() {
        return new LiveProgramView();
    }

    protected getModels() {
        return {
            LiveProgramCardViewModel: this.container.get("LiveProgramCardViewModel")
        };
    }
}

export default LiveProgramComponent;

