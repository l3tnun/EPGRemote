"use strict";

import * as m from 'mithril';
import { Vnode, VnodeDOM } from 'mithril';
import View from '../View';
import DialogViewModel from "../../ViewModel/Dialog/DialogViewModel";

/**
* Dialog View
* @param id dialog を一意に特定する id
* @param content dialog の中身
* @param width dialog の幅
* @param autoScroll dialog の高さが画面の高さを超えた時
*                   dialog の中身をスクロールさせるか
*                   true: 有効, false: 無効
* @throw DialogView option Error options が正しくない場合発生
*/
class DialogView extends View {
    private id: string;
    private content: Vnode<any, any>;
    private action: Vnode<any, any> | null = null;
    private width: number;
    private autoScroll: boolean = true;
    private scrollOffset: number = 60;
    private dialogViewModel: DialogViewModel;
    private dialogStatus: boolean = false;

    /**
    * @throw DialogView option Error options が正しくない場合発生
    */
    protected checkOptions(): void {
        if(!this.typeCheck("id", "string") || !this.typeCheck("width", "number") || typeof this.options["content"] == "undefined") {
            console.log(this.options);
            throw new Error('DialogView option Error options');
        }

        this.id = this.options["id"];
        this.content = this.options["content"];
        if(this.options["action"] != "undefined") { this.action = this.options["action"]; }
        this.width = this.options["width"];
        if(this.typeCheck("autoScroll", "boolean")) { this.autoScroll = this.options["autoScroll"]; }
        if(this.typeCheck("scrollOffset", "number")) { this.scrollOffset = this.options["scrollOffset"]; }
    }

    public execute(): Vnode<any, any> {
        this.dialogViewModel = <DialogViewModel>this.getModel("DialogViewModel");

        let child = [this.content];
        if(this.action != null) { child.push(this.action); }

        return m("div", {
            id: this.getDialogId(),
            class: "dialog",
            oninit: () => { this.dialogStatus = false; },
            onupdate: (vnode: VnodeDOM<any, any>) => { this.dialogConfig(vnode.dom); },
            onclick: (e: Event) => { this.onclick(e) }
        }, [
            m("div", {
                id: this.getContentId(),
                class: "dialog-content",
                style: `max-width: ${ this.width }px; overflow: auto; -webkit-overflow-scrolling: touch;`
            }, child)
        ]);
    }

    private dialogConfig(element: Element): void {
        let dialogContentParent = document.getElementById(this.getContentId())!;
        let dialogContentChild = <HTMLElement>(<HTMLElement>document.getElementById(this.getContentId())).children[0];
        dialogContentChild.style.overflow = "auto";

        let offset = this.autoScroll ? this.scrollOffset : 0;
        let padding = this.getPadding(dialogContentChild);

        //action 分の高さを加える
        if(this.action != null) {
            let action = <HTMLElement>(<HTMLElement>document.getElementById(this.getContentId())).children[1];
            padding += action.offsetHeight + this.getPadding(action);
        }

        //dialog のスクロール設定
        if(dialogContentParent.offsetHeight >= window.innerHeight - offset && offset > 0) {
            dialogContentParent.style.height = `${ window.innerHeight - offset }px`;
            dialogContentChild.style.height = `${ window.innerHeight - offset - padding }px`;
            if(!this.dialogStatus && this.dialogViewModel.getStatus(this.id)) {
                dialogContentChild.scrollTop = 0; //scroll位置を初期化
            }
        } else {
            dialogContentParent.style.height = "";
            dialogContentChild.style.height = "";
        }

        //dialog 表示
        if(this.dialogViewModel.getStatus(this.id)) {
            if(this.dialogStatus) {
                element.setAttribute("style", "opacity: 1;");
            } else {
                element.setAttribute("style", "opacity: 0;");
                setTimeout(() => {
                    element.setAttribute("style", "opacity: 1;");
                    m.redraw();
                }, 100);
            }
        } else { //非表示
            element.setAttribute("style", "opacity: 0;");
            setTimeout(() => {
                if(this.dialogViewModel.getStatus(this.id)) { return; }
                element.setAttribute("style", "display: none;");
            }, 100);
        }

        this.dialogStatus = this.dialogViewModel.getStatus(this.id);
    }

    private getPadding(element: HTMLElement): number {
        try {
            let top = window.getComputedStyle(element, undefined).getPropertyValue('padding-top');
            let bottom = window.getComputedStyle(element, undefined).getPropertyValue('padding-bottom');

            if(top.indexOf("px") != -1 && bottom.indexOf("px") != -1) {
                return Number(top.replace(/[^0-9^\.]/g,"")) + Number(bottom.replace(/[^0-9^\.]/g,""));
            } else {
                return 0;
            }
        } catch(e) {
            return 0;
        }
    }

    private onclick(e: Event): void {
        if((<HTMLElement>(e.target)).id == this.getDialogId()) {
            this.dialogViewModel.close();
        } else {
            (<any>e).redraw = false;
        }
    }

    private getDialogId(): string {
        return this.id + "_dialog_";
    }

    private getContentId(): string {
        return this.id + "_dialog_content_";
    }
}

export default DialogView;

