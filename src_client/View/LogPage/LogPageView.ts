"use strict";

import * as m from 'mithril';
import { Vnode, VnodeDOM } from 'mithril';
import ParentPageView from '../ParentPageView';
import Util from '../../Util/Util';
import DateUtil from '../../Util/DateUtil';
import Scroll from '../../Util/Scroll';
import LogPageViewModel from '../../ViewModel/LogPage/LogPageViewModel';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import LogPageActionDialogContentComponent from '../../Component/LogPage/LogPageActionDialogContentComponent';
import LogPageActionDialogViewModel from '../../ViewModel/LogPage/LogPageActionDialogViewModel';

/**
* Log の View
*/
class LogPageView extends ParentPageView {
    private viewModel: LogPageViewModel;
    private dialogViewModel: DialogViewModel;
    private actionViewModel: LogPageActionDialogViewModel;

    private logPageActionDialogContentComponent = new LogPageActionDialogContentComponent();

    public execute(): Vnode<any, any> {
        this.viewModel = <LogPageViewModel>this.getModel("LogPageViewModel");
        this.dialogViewModel = <DialogViewModel>this.getModel("DialogViewModel");
        this.actionViewModel = <LogPageActionDialogViewModel>this.getModel("LogPageActionDialogViewModel");

        return m("div", { class: "mdl-layout mdl-js-layout mdl-layout--fixed-header" }, [
            //scroll top button
            m("button", { class: "fab-right-bottom mdl-shadow--8dp mdl-button mdl-js-button mdl-button--fab mdl-button--colored",
                onclick: () => {
                    let mainLayout = document.getElementsByClassName("mdl-layout__content")[0];
                    Scroll.scrollTo(mainLayout, mainLayout.scrollTop, 0);
                }
            }, m("i", { class: "material-icons" }, "arrow_upward") ),

            this.createHeader("動作ログ"),
            this.createHeaderMenu(),
            this.createNavigation(),

            this.mainLayout([
                this.createOption(),
                this.createList()
            ]),

            m(this.getDialogComponent("log_action_dialog"), {
                id: "log_action_dialog",
                width: 280,
                content: m(this.logPageActionDialogContentComponent)
            }),

            //ディスク空き容量ダイアログ
            this.createDiskDialog(),

            //snackbar
            this.createSnackbar()
        ]);
    }

    //option 部分
    private createOption(): Vnode<any, any> {
        return m("div", { class: "log-card mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col" }, [
            m("div", { class: "mdl-card__supporting-text" }, [
                this.createCheckBox("情報", this.viewModel.info, (value) => { this.viewModel.info = value }),
                this.createCheckBox("警告", this.viewModel.warning, (value) => { this.viewModel.warning = value }),
                this.createCheckBox("エラー", this.viewModel.error, (value) => { this.viewModel.error = value }),
                this.createCheckBox("DEBUG", this.viewModel.debug, (value) => { this.viewModel.debug = value }),
            ])
        ]);
    }

    //chekcbox 作成
    private createCheckBox(labelName: string, value: boolean, callback:(value: boolean) => void): Vnode<any, any> {
        return m("label", { class: "log-card-checkbox mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" }, [
            m("input", {
                class: "mdl-checkbox__input",
                type: "checkbox",
                checked: value,
                onchange: m.withAttr("checked", (value) => { callback(value); this.viewModel.update(); } ),
                oncreate: () => { this.checkboxInit(); },
                onupdate: (vnode: VnodeDOM<any, any>) => { this.checkboxConfig(<HTMLInputElement>(vnode.dom)); }
            }),
            m("span", { class: "mdl-checkbox__label" }, labelName )
        ]);
    }

    //card list 作成
    private createList(): Vnode<any, any>[] {
        return this.viewModel.getLogList().map((data: { [key: string]: any }) => {
            return this.createListContent(data);
        })
    }

    //card の中身
    private createListContent(data: { [key: string]: any }): Vnode<any, any> {
        return m("div", {
            class: `log-card-level${ data["level"] } log-card mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col`,
            onclick: () => {
                let link = data["link"];
                if(typeof link != "undefined" && Util.hashSize(link) > 0) {
                    this.actionViewModel.setLink(data["link"]);
                    this.dialogViewModel.open("log_action_dialog");
                }
            }
        }, [
            this.createAnnouncementIcon(data["link"]),
            m("div", { class: "mdl-card__supporting-text" }, [
                m("div", { class: "log-card-title" }, [
                    this.getTimeStr(new Date(data["logtime"])) + " " + LogPageView.levelHashStr[data["level"]]
                ]),
                m("div", { class: "log-card-messeage" }, data["message"])
            ])
        ]);
    }

    //icon
    private createAnnouncementIcon(link: {}): Vnode<any, any> {
        if(typeof link == "undefined" || Util.hashSize(link) == 0) { return m("div"); }

        return m("i", { class: "log-dialog-icon material-icons" }, "announcement");
    }

    private getTimeStr(date: Date): string {
        let jaDate = DateUtil.getJaDate(date);

        return DateUtil.format(jaDate, "yyyy-MM-dd hh:mm:ss");
    }
}

namespace LogPageView {
    export const levelHashStr = {
        0: "情報",
        1: "警告",
        2: "エラー",
        3: "DEBUG"
    }
}

export default LogPageView;

