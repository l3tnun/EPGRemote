"use strict";

import Component from '../../Component';
import LiveWatchOtherStreamInfoView from '../../../View/Live/Watch/LiveWatchOtherStreamInfoView';

/**
* LiveWatchOtherStreamInfo Component
*  @param { streamId: 0 } の形式で streamId を与える
*/
class LiveWatchOtherStreamInfoComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new LiveWatchOtherStreamInfoView();
    }

    protected getModels() {
        return {
            LiveWatchOtherStreamInfoViewModel: this.container.get("LiveWatchOtherStreamInfoViewModel")
        };
    }
}

export default LiveWatchOtherStreamInfoComponent;

