"use strict";

import Component from '../Component';
import TopPageController from '../../Controller/TopPage/TopPageController';
import TopPageView from '../../View/TopPage/TopPageView';

class TopPageComponent extends Component {
    protected getController() {
        return new TopPageController();
    }

    protected getView() {
        return new TopPageView();
    }

    protected getModels() {
        return null;
    }
}

export default TopPageComponent;

