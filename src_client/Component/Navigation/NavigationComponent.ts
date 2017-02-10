"use strict";

import Component from '../Component';
import NavigationView from '../../View/Navigation/NavigationView';
import NavigationController from '../../Controller/Navigation/NavigationController';

class NavigationComponent extends Component {
    protected getController() {
        return new NavigationController();
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

