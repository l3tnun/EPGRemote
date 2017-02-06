"use strict";

import * as m from 'mithril';
import View from '../View';
import Scroll from '../../Util/Scroll';
import SearchViewModel from '../../ViewModel/Search/SearchViewModel';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import DateUtil from '../../Util/DateUtil';
import ProgramInfoDialogViewModel from '../../ViewModel/Program/ProgramInfoDialogViewModel';

/**
* SearchResult の View
*/
class SearchResultView extends View {
    private viewModel: SearchViewModel;
    private dialog: DialogViewModel;
    private programInfoDialogViewModel: ProgramInfoDialogViewModel;

    public execute(): Mithril.Vnode<any, any> {
        this.viewModel = <SearchViewModel>this.getModel("SearchViewModel");
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");
        this.programInfoDialogViewModel = <ProgramInfoDialogViewModel>this.getModel("ProgramInfoDialogViewModel");

        //検索結果非表示
        if(!this.viewModel.resultShowStatus) { return m("div"); }

        return m("div", { style: "margin-top: 32px;" }, [
            //ヒット件数
            m("div", {
                class: "search-result-hit-num",
                onupdate: (vnode: Mithril.VnodeDOM<any, any>) => {
                    //スクロール処理
                    if(this.viewModel.scrollStatus) {
                        this.viewModel.scrollStatus = false;
                        let mainLayout = document.getElementsByClassName("mdl-layout__content")[0];
                        let start = mainLayout.scrollTop;
                        let end = vnode.dom.getBoundingClientRect().top - 98 + mainLayout.scrollTop;

                        setTimeout(() => { Scroll.scrollTo(mainLayout, start, end); }, 100);
                    }
                }
            }, this.viewModel.getResult().length + "件ヒットしました。"),

            //検索結果
            this.viewModel.getResult().map((program: { [key: string]: any }) => {
                return this.createContent(program);
            })
        ]);
    }

    private createContent(program: { [key: string]: any }): Mithril.Vnode<any, any> {
        let addClass = "";
        if(program["autorec"] == 0) { addClass += " tv_program_freeze "; }
        if(program["recorded"]) { addClass += " tv_program_reced "; }

        return m("div", {
            id: "prgID_" + program["id"],
            class: "reservation-card mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col" + addClass,
            onclick: () => {
                let channel: { [key: string]: any } | null = null;
                this.viewModel.getChannel().map((c: { [key: string]: any }) => {
                    if(c["id"] == program["channel_id"]) { channel = c; }
                });

                if(channel == null) {
                    console.log("SearchResult ProgramInfo channel error");
                    return;
                }

                this.programInfoDialogViewModel.setProgram(
                    program,
                    channel,
                    this.viewModel.getRecMode(),
                    this.viewModel.getRecModeDefaultId()
                );
                this.dialog.open(ProgramInfoDialogViewModel.infoDialogId);
            }
         }, [
            m("div", { class: "mdl-card__supporting-text" }, [
                m("div", { class: "reservation-card-title" }, program["title"]),
                m("div", { class: "reservation-card-time" }, this.createTimeStr(program)),
                m("div", { class: "reservation-card-channel-name" }, `${ program["type"] }: ${ program["channel_name"] }`),
                m("div", { class: "reservation-card-description" }, program["description"])
            ])
        ]);
    }

    private createTimeStr(program: { [key: string]: any }): string {
        let start = DateUtil.getJaDate(new Date(program["starttime"]));
        let end = DateUtil.getJaDate(new Date(program["endtime"]));

        let diff = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);

        return `${ DateUtil.format(start, "MM/dd(w) hh:mm") } ~ ${ DateUtil.format(end, "hh:mm") }(${ diff }分)`;
    }
}

export default SearchResultView;

