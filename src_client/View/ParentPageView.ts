"use strict";

import * as m from 'mithril';
import View from './View';
import Util from '../Util/Util';
import NavigationComponent from '../Component/Navigation/NavigationComponent';
import HeaderComponent from '../Component/Header/HeaderComponent';
import HeaderMenuIconComponent from '../Component/Header/HeaderMenuIconComponent';
import HeaderMenuListComponent from '../Component/Header/HeaderMenuListComponent';
import DiskMenuContentComponent from '../Component/Disk/DiskMenuContentComponent';
import DialogComponent from '../Component/Dialog/DialogComponent';
import DiskDialogComponent from '../Component/Disk/DiskDialogComponent';
import DiskDialogViewModel from '../ViewModel/Disk/DiskDialogViewModel';
import SnackbarComponent from '../Component/Snackbar/SnackbarComponent';

/**
* ParentPage View
* 親ページの View で使用される
*/
abstract class ParentPageView extends View {
    //Mithril へ渡される部分
    public abstract execute(): Mithril.VirtualElement

    /**
    * header 作成
    * @param title title
    * @param leftButton leftButton content
    */
    protected createHeader(title: string, leftButton: any[] = []): Mithril.Component<{}> {
        leftButton.push(m.component(new HeaderMenuIconComponent(), {
            id: ParentPageView.headerMenuId
        }));

        return m.component(new HeaderComponent(), {
            title: title,
            leftButton: leftButton
        });
    }

    /**
    * header メニュー作成
    * @param content メニューコンテント
    */
    protected createHeaderMenu(content: any[] = []): Mithril.Component<{}> {
        content.push(m.component(new DiskMenuContentComponent())); //ディスク空き容量メニュー

        return m.component(new HeaderMenuListComponent(), {
            id: ParentPageView.headerMenuId,
            content: content
        });
    }

    /**
    * Navigation 作成
    */
    protected createNavigation(): Mithril.Component<{}> {
        return m.component(new NavigationComponent())
    }

    /**
    * ディスク空き容量ダイアログ
    */
    protected createDiskDialog(): Mithril.Component<{}> {
        return m.component(new DialogComponent(), {
            id: DiskDialogViewModel.dialogId,
            width: 250,
            content: m.component(new DiskDialogComponent())
        });
    }

    /**
    * SnackbarComponent 生成
    */
    protected createSnackbar(): Mithril.Component<{}> {
        return m.component(new SnackbarComponent());
    }

    /**
    * main layout
    * @param content content
    */
    protected mainLayout(content: any): Mithril.VirtualElement {
        return m("main", {
            class: "mdl-layout__content",
            config: (element, isInit, context) => {
                if(!Util.isEnableHistory()) { return; }
                this.saveScrollPosition(element, isInit, context);
            }
        }, [
            m("div", { class: "page-content" }, [
                content
            ])
        ]);
    }

    /**
    * scroll position を記録 & 復元を行う
    */
    protected saveScrollPosition(element: Element, isInit: boolean, context: Mithril.Context): void {
        if(!isInit) {
            //scroll position の記録
            element.addEventListener("scroll", (() => {
                this.saveScrollPostion(element.scrollTop, element.scrollLeft);
            }).bind(this), false);
            context["isRestored"] = false;
        } else if(history.state != null && !context["isRestored"]){
            //scroll position の復元
            this.restoreScrollPosition(element);
            context["isRestored"] = true;
        }
    }

    /**
    * history.state に scroll position を記録する
    * @param top top
    * @param left lef
    */
    protected saveScrollPostion(top: number, left: number): void {
        history.replaceState({ top: top, left: left }, document.title);
    }

    /**
    * scroll position を復元する
    * @param element Element
    */
    protected restoreScrollPosition(element: Element): void {
        let state = history.state;
        element.scrollTop = state["top"];
        element.scrollLeft = state["left"];
    }
}

namespace ParentPageView {
    export const headerMenuId = "header_menu";
}

export default ParentPageView;

