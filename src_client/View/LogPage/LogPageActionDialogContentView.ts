"use strict";

import * as m from 'mithril';
import { Vnode } from 'mithril';
import View from '../View';
import LogPageActionDialogViewModel from '../../ViewModel/LogPage/LogPageActionDialogViewModel';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';

/**
* LogPageActionDialogContent View
*/
class LogPageActionDialogContentView extends View {
    private viewModel: LogPageActionDialogViewModel;
    private dialog: DialogViewModel;

    public execute(): Vnode<any, any> {
        this.viewModel = <LogPageActionDialogViewModel>this.getModel("LogPageActionDialogViewModel");
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");

        let link = this.viewModel.getLink();
        if(link == null) { return m("div", "empty"); }

        return m("div", { class: "log-dialog-frame" }, [
            this.createSearchLink(link),
            this.createProgramLink(link),
            this.createRecordedLink(link)
        ]);
    }

    private createSearchLink(link: { [key: string]: any }): Vnode<any, any> {
        let search = link["search"];
        if(typeof search == "undefined") { return m("div"); }

        return m("button", {
            class: "log-action-button mdl-button mdl-js-button mdl-button--primary",
            onclick: () => { this.movePage(`/search?${ search }`); }
        }, "該当自動録画キーワードを編集");
    }

    private createProgramLink(link: { [key: string]: any }): Vnode<any, any> {
        let program = link["program"];
        if(typeof program == "undefined") { return m("div"); }

        return m("button", {
            class: "log-action-button mdl-button mdl-js-button mdl-button--primary",
            onclick: () => { this.movePage(`/program?${ program }`); }
        }, "該当時刻の番組表を見る");
    }

    private createRecordedLink(link: { [key: string]: any }): Vnode<any, any> {
        let recorded = link["recorded"];
        if(typeof recorded == "undefined") { return m("div"); }

        return m("button", {
            class: "log-action-button mdl-button mdl-js-button mdl-button--primary",
            onclick: () => { this.movePage(`/recorded?${ recorded }`); }
        }, "該当録画済み番組を見る");
    }

    /**
    * ダイアログを閉じて指定した url に移動する
    * @param url 移動先リンク
    */
    private movePage(url: string): void {
        this.dialog.close();
        setTimeout( () => { m.route.set(url); }, 300);
    }
}

export default LogPageActionDialogContentView;

