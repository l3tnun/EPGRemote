"use strict";

import Component from '../Component';
import MenuView from '../../View/Menu/MenuView';

/**
* Menu Component
* @param id id
* @param content Mithril.VirtualElement
*/
class MenuComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new MenuView();
    }

    protected getModels() {
        return  {
            MenuViewModel: this.container.get("MenuViewModel")
        };
    }
}

export default MenuComponent;

