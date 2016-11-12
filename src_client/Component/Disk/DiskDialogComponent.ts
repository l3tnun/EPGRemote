"use strict";

import Component from '../Component';
import DiskDialogView from '../../View/Disk/DiskDialogView';

class DiskDialogComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new DiskDialogView();
    }

    protected getModels() {
        return {
            DiskDialogViewModel: this.container.get("DiskDialogViewModel")
        };
    }
}

export default DiskDialogComponent;

