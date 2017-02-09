"use strict";

import Component from '../Component';
import ParentPageController from '../../Controller/ParentPageController';
import TopPageView from '../../View/TopPage/TopPageView';

class TopPageComponent extends Component {
    protected getController() {
        return new ParentPageController();
    }

    protected getView() {
        return new TopPageView();
    }

    protected getModels() {
        return null;
    }
}

export default TopPageComponent;

