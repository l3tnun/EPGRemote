"use strict";

import Component from '../Component';
import DiskMenuContentView from '../../View/Disk/DiskMenuContentView';

class DiskMenuContentComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new DiskMenuContentView();
    }

    protected getModels() {
        return {
            DiskDialogViewModel: this.container.get("DiskDialogViewModel"),
            DialogViewModel: this.container.get("DialogViewModel")
        };
    }
}

export default DiskMenuContentComponent;

