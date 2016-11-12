"use strict";

import * as m from 'mithril';
import Util from '../../Util/Util';
import View from '../View';
import MenuViewModel from '../../ViewModel/Menu/MenuViewModel';

/**
* Menu View
* @param id menu を一意に特定する id
* @param content menu の中身
* @throw MenuView option Error options が正しくない場合発生
*/
class MenuView extends View {
    private id: string;
    private content: Mithril.VirtualElement;
    private viewModel: MenuViewModel;

    /**
    * @throw MenuView option Error options が正しくない場合発生
    */
    protected checkOptions(): void {
        if(!this.typeCheck("id", "string") || typeof this.options["content"] == "undefined") {
            console.log(this.options);
            throw new Error('MenuView option Error');
        }
        this.id = this.options["id"];
        this.content = this.options["content"];
    }

    public execute(): Mithril.VirtualElement {
        this.viewModel = <MenuViewModel>this.getModel("MenuViewModel");

        return m("div", [
            m("div", {
                id: this.id,
                class: "menu-list mdl-shadow--2dp",
                config: (element, isInit, context) => {
                    if(this.id == this.viewModel.getId()) {
                        this.openConfig(<HTMLElement>element, isInit, context);
                    } else {
                        this.closeConfig(<HTMLElement>element, isInit, context);
                    }
                }
            }, this.content ),
            m("div", {
                class: MenuViewModel.backgroundClass,
                style: this.id == this.viewModel.getId() ? "display: block;" : "display: none;",
                onclick: () => {
                    this.viewModel.close();
                }
            })
        ]);
    }

    /**
    * menu を開くときの設定
    */
    private openConfig(element: HTMLElement, _isInit: boolean, _context: Mithril.Context): void {
        let rect = this.viewModel.getRect();
        if(rect == null) { return; }

        let headerHeight = Util.getHeaderHeight();
        let menuHeight = element.clientHeight;
        let scrollTopOffset = document.getElementsByClassName("mdl-layout__content")[0].scrollTop;
        let scrollLeftOffset = document.getElementsByClassName("mdl-layout__content")[0].scrollLeft;
        let menuTopPosition = rect.top - headerHeight + scrollTopOffset - (menuHeight / 2) + 16;
        let menuLeftPosition = rect.left - element.clientWidth + scrollLeftOffset;

        //表示領域からはみ出た時
        //上
        if(menuTopPosition - scrollTopOffset < 0) {
            menuTopPosition -= (menuTopPosition - scrollTopOffset) - 6;
        }
        //下
        if(menuTopPosition + menuHeight - scrollTopOffset > window.innerHeight - headerHeight) {
            menuTopPosition -= ( (menuTopPosition + menuHeight - scrollTopOffset) - (window.innerHeight - headerHeight)) + 6;
        }

        element.style.top = menuTopPosition + "px";
        element.style.left = menuLeftPosition + "px";
        element.style.visibility = "visible";
        element.style.opacity = "1";

        //content 表示
        let ListArray = this.getChildren(element);
        ListArray.map((list: HTMLElement) => {
            list.style.opacity = "1";
            setTimeout(() => {
                list.style.visibility = "";
                list.style.top = "";
                list.style.left = "";
            }, 100);
        });
    }

    /**
    * menu を閉じるときの設定
    */
    private closeConfig(element: HTMLElement, _isInit: boolean, _context: Mithril.Context): void {
        //content 非表示
        let ListArray = this.getChildren(element);
        ListArray.map((list: HTMLElement) => {
            if(Number(list.style.opacity) == 0) { return; }

            list.style.opacity = "0";
            setTimeout(() => {
                list.style.visibility = "hidden";
                list.style.top = "0";
                list.style.left = "0";
            }, 100);
        });


        if(Number(element.style.opacity) == 0) { return; }
        //element 非表示
        setTimeout(() => {
            element.style.top = "";
            element.style.left = "";
            element.style.visibility = "";
            element.style.opacity = "0";
        }, 100);
    }

    private getChildren(element: HTMLElement): HTMLElement[] {
        let children = (<HTMLElement>element).children;
        if(typeof children == "undefined" || children == null || children.length == 0) {
            return [];
        }

        return Array.prototype.slice.call(children[0].children);
    }
}

export default MenuView;

