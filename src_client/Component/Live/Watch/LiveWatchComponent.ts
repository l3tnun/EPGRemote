"use strict";

import Component from '../../Component';
import LiveWatchController from '../../../Controller/Live/Watch/LiveWatchController';
import LiveWatchView from '../../../View/Live/Watch/LiveWatchView';

class LiveWatchComponent extends Component {
    protected getController() {
        return new LiveWatchController();
    }

    protected getView() {
        return new LiveWatchView();
    }

    protected getModels() {
        return {
            LiveWatchViewModel: this.container.get("LiveWatchViewModel"),
            LiveProgramCardViewModel: this.container.get("LiveProgramCardViewModel")
        };
    }
}

export default LiveWatchComponent;

