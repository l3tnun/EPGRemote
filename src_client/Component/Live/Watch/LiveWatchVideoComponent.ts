"use strict";

import Component from '../../Component';
import LiveWatchVideoController from '../../../Controller/Live/Watch/LiveWatchVideoController';
import LiveWatchVideoView from '../../../View/Live/Watch/LiveWatchVideoView';

class LiveWatchVideoComponent extends Component {
    protected getController() {
        return new LiveWatchVideoController();
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

