"use strict";

import Component from '../Component';
import NavigationView from '../../View/Navigation/NavigationView';

class NavigationComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new NavigationView();
    }

    protected getModels() {
        return  {
            NavigationViewModel: this.container.get("NavigationViewModel")
        };
    }
}

export default NavigationComponent;

