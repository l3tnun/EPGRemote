"use strict";

import Component from '../Component';
import HeaderView from '../../View/Header/HeaderView';

/**
* Header Component
* @param { title: "タイトル" } の形式でヘッダーのタイトルを与える
* @param { leftButton: m.component() } の形式でヘッダーの左側のボタンを与える
* @throw HeaderTitleError title が指定されていない時に発生する例外
*/
class HeaderComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new HeaderView();
    }

    protected getModels() {
        return null;
    }
}

export default HeaderComponent;

