"use strict";

import Component from '../../Component';
import LiveWatchVideoView from '../../../View/Live/Watch/LiveWatchVideoView';

class LiveWatchVideoComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new LiveWatchVideoView();
    }

    protected getModels() {
        return {
            LiveWatchVideoViewModel: this.container.get("LiveWatchVideoViewModel")
        };
    }
}

export default LiveWatchVideoComponent;

