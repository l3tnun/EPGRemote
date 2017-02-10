"use strict";

import Component from '../../Component';
import LiveWatchStreamInfoController from '../../../Controller/Live/Watch/LiveWatchStreamInfoController';
import LiveWatchStreamInfoView from '../../../View/Live/Watch/LiveWatchStreamInfoView';

/**
* LiveWatchStreamInfo Component
*/
class LiveWatchStreamInfoComponent extends Component {
    protected getController() {
        return new LiveWatchStreamInfoController();
    }

    protected getView() {
        return new LiveWatchStreamInfoView();
    }

    protected getModels() {
        return {
            LiveWatchStreamInfoViewModel: this.container.get("LiveWatchStreamInfoViewModel")
        };
    }
}

export default LiveWatchStreamInfoComponent;

