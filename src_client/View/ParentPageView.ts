"use strict";

import * as m from 'mithril';
import View from './View';
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
            class: "fadeIn mdl-layout__content",
            config: (element, isInit) => {
                this.addShowAnimetion(element, isInit);
            }
        }, [
            m("div", {class: "page-content" }, [
                content
            ])
        ]);
    }
}

namespace ParentPageView {
    export const headerMenuId = "header_menu";
}

export default ParentPageView;

