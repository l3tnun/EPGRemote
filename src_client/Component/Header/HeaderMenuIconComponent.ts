"use strict";

import Component from '../Component';
import HeaderMenuIconView from '../../View/Header/HeaderMenuIconView';

/**
* Header Component
* @param { id: "id string" } の形式でメニューに id を与える
*/
class HeaderMenuIconComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new HeaderMenuIconView();
    }

    protected getModels() {
        return null;
    }
}

export default HeaderMenuIconComponent;

