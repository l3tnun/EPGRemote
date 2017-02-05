"use strict";

import * as m from 'mithril';
import ViewModel from '../ViewModel';

/**
* Menu の ViewModel
*/
class MenuViewModel extends ViewModel {
    private menuId: string | null = null;
    private buttonElement: Element | null = null;

    /**
    * menu を開く
    * @param id menu の id (menu の中身)
    * @param buttonElement menu の表示場所の基準となる Element
    */
    public open(id: string, buttonElement: Element): void {
        this.menuId = id;
        this.buttonElement = buttonElement;

        m.redraw.strategy("diff");
        m.redraw();
    }

    //menu を閉じる
    public close(): void {
        this.menuId = null;
        this.buttonElement = null;

        m.redraw.strategy("diff");
        m.redraw();
    }

    /**
    * 開く menu の id を返す
    */
    public getId(): string | null {
        return this.menuId;
    }

    /**
    * menu 表示場所の基準となる ClientRect を返す
    */
    public getRect(): ClientRect | null {
        return this.buttonElement == null ? null : this.buttonElement.getBoundingClientRect();
    }

}

namespace MenuViewModel {
    export const backgroundClass = "menu-background";
}

export default MenuViewModel;

