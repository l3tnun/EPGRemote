"use strict";

import Component from '../Component';
import HeaderMenuListView from '../../View/Header/HeaderMenuListView';

/**
* Header Component
* @param { id: "id string" } の形式で対応する MenuIcon の id を与える
* @param { content: [ m.component(hoge) ] } の形式でメニューの中身を与える
*/
class HeaderMenuListComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new HeaderMenuListView();
    }

    protected getModels() {
        return null;
    }
}

export default HeaderMenuListComponent;

