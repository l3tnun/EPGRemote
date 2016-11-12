"use strict";

import Component from '../../Component';
import LiveWatchStreamInfoView from '../../../View/Live/Watch/LiveWatchStreamInfoView';

/**
* LiveWatchStreamInfo Component
*/
class LiveWatchStreamInfoComponent extends Component {
    protected getController() {
        return null;
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

