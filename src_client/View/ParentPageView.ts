"use strict";

import * as m from 'mithril';
import { Vnode, VnodeDOM } from 'mithril';
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
    private dialogComponents: { [key: string]: DialogComponent } = {};
    private headerMenuIconComponent = new HeaderMenuIconComponent();
    private headerComponent = new HeaderComponent();
    private diskMenuContentComponent = new DiskMenuContentComponent();
    private headerMenuListComponent = new HeaderMenuListComponent();
    private navigationComponent = new NavigationComponent();
    private diskDialogComponent = new DiskDialogComponent();
    private snackbarComponent = new SnackbarComponent();

    //Mithril へ渡される部分
    public abstract execute(): Vnode<any, any>

    /**
    * DialogComponent を生成する
    * @param id View 内で重複しない文字列
    */
    protected getDialogComponent(id: string): DialogComponent {
        if(typeof this.dialogComponents[id] == "undefined") {
            this.dialogComponents[id] = new DialogComponent();
        }

        return this.dialogComponents[id];
    }

    /**
    * header 作成
    * @param title title
    * @param leftButton leftButton content
    */
    protected createHeader(title: string, leftButton: any[] = []): Vnode<any, any> {
        leftButton.push(m(this.headerMenuIconComponent, {
            id: ParentPageView.headerMenuId
        }));

        return m(this.headerComponent, {
            title: title,
            leftButton: leftButton
        });
    }

    /**
    * header メニュー作成
    * @param content メニューコンテント
    */
    protected createHeaderMenu(content: any[] = []): Vnode<any, any> {
        content.push(m(this.diskMenuContentComponent)); //ディスク空き容量メニュー

        return m(this.headerMenuListComponent, {
            id: ParentPageView.headerMenuId,
            content: content
        });
    }

    /**
    * Navigation 作成
    */
    protected createNavigation(): Vnode<any, any> {
        return m(this.navigationComponent)
    }

    /**
    * ディスク空き容量ダイアログ
    */
    protected createDiskDialog(): Vnode<any, any> {
        return m(this.getDialogComponent(DiskDialogViewModel.dialogId), {
            id: DiskDialogViewModel.dialogId,
            width: 250,
            content: m(this.diskDialogComponent)
        });
    }

    /**
    * SnackbarComponent 生成
    */
    protected createSnackbar(): Vnode<any, any> {
        return m(this.snackbarComponent);
    }

    /**
    * main layout
    * @param content content
    */
    protected mainLayout(
        content: any,
        oncreate: ((vnode: VnodeDOM<any, any>) => void) | null = null
    ): Vnode<any, any> {
        return m("main", {
            class: "mdl-layout__content",
            oncreate: (vnode: VnodeDOM<any, any>) => {
                if(oncreate != null) { oncreate(vnode); }
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

