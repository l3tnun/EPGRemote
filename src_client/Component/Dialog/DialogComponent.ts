"use strict";

import Component from '../Component';
import DialogView from '../../View/Dialog/DialogView';
import DialogController from '../../Controller/Dialog/DialogController';

/**
* Dialog Component
* @param id id
* @param content Mithril.VirtualElement
* @param width dialog width
* @param autoScroll ウインドウ高さ > dialog 高さ のとき自動でサイズを調整し、スクロール可能にする
         true: 有効(default), false: 無効
* @param scrollOffset scroll offset 必須ではない
*/
class DialogComponent extends Component {
    protected getController() {
        return new DialogController();
    }

    protected getView() {
        return new DialogView();
    }

    protected getModels() {
        return  { DialogViewModel: this.container.get("DialogViewModel") };
    }
}

export default DialogComponent;

