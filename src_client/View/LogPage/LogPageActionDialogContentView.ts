"use strict";

import * as m from 'mithril';
import View from '../View';
import LogPageActionDialogViewModel from '../../ViewModel/LogPage/LogPageActionDialogViewModel';

/**
* LogPageActionDialogContent View
*/
class LogPageActionDialogContentView extends View {
    private viewModel: LogPageActionDialogViewModel;

    public execute(): Mithril.VirtualElement {
        this.viewModel = <LogPageActionDialogViewModel>this.getModel("LogPageActionDialogViewModel");

        let link = this.viewModel.getLink();
        if(link == null) { return m("div", "empty"); }

        return m("div", { class: "log-dialog-frame" }, [
            this.createSearchLink(link),
            this.createProgramLink(link),
            this.createRecordedLink(link)
        ]);
    }

    private createSearchLink(link: { [key: string]: any }): Mithril.VirtualElement {
        let search = link["search"];
        if(typeof search == "undefined") { return m("div"); }

        return m("a", {
            class: "log-action-button mdl-button mdl-js-button mdl-button--primary",
            href: `/search?${ search }`,
            config: m.route
        }, "該当自動録画キーワードを編集");
    }

    private createProgramLink(link: { [key: string]: any }): Mithril.VirtualElement {
        let program = link["program"];
        if(typeof program == "undefined") { return m("div"); }

        return m("a", {
            class: "log-action-button mdl-button mdl-js-button mdl-button--primary",
            href: `/program?${ program }`,
            config: m.route
        }, "該当時刻の番組表を見る");
    }

    private createRecordedLink(link: { [key: string]: any }): Mithril.VirtualElement {
        let recorded = link["recorded"];
        if(typeof recorded == "undefined") { return m("div"); }

        return m("a", {
            class: "log-action-button mdl-button mdl-js-button mdl-button--primary",
            href: `/recorded?${ recorded }`,
            config: m.route
        }, "該当録画済み番組を見る");
    }
}

export default LogPageActionDialogContentView;

