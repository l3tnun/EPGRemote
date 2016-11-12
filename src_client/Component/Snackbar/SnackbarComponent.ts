"use strict";

import Component from '../Component';
import SnackbarView from '../../View/Snackbar/SnackbarView';

/**
* Snackbar Component
*/
class SnackbarComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new SnackbarView();
    }

    protected getModels() {
        return {
            SnackbarViewModel: this.container.get("SnackbarViewModel")
        };
    }
}

export default SnackbarComponent;

