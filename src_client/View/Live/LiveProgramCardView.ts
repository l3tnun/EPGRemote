"use strict";

import * as m from 'mithril';
import { Vnode } from 'mithril';
import View from '../View';
import LiveProgramCardViewModel from '../../ViewModel/Live/LiveProgramCardViewModel';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import LiveProgramDialogContentViewModel from '../../ViewModel/Live/LiveProgramDialogContentViewModel';
import DateUtil from '../../Util/DateUtil';

/**
* LiveProgramCard 部分の View
* @param _viewSingle true: 単一カード表示, false: 複数カード表示
* @throw LiveProgramCardView option Error options が正しくない場合発生
*/
class LiveProgramCardView extends View {
    private viewSingle: boolean;
    private viewModel: LiveProgramCardViewModel;
    private dialogViewModel: DialogViewModel;
    private dialogContentViewModel: LiveProgramDialogContentViewModel;

    /**
    * @throw LiveProgramCardView option Error options が正しくない場合発生
    */
    protected checkOptions(): void {
        if(!this.typeCheck("single", "boolean")) {
            console.log(this.options);
            throw new Error('LiveProgramCardView option Error');
        }
        this.viewSingle = this.options["single"];
    }

    public execute(): Vnode<any, any> {
        this.viewModel = <LiveProgramCardViewModel>this.getModel("LiveProgramCardViewModel");
        this.dialogViewModel = <DialogViewModel>this.getModel("DialogViewModel");
        this.dialogContentViewModel = <LiveProgramDialogContentViewModel>this.getModel("LiveProgramDialogContentViewModel");

        return m("div", { id: LiveProgramCardViewModel.cardParentId }, [
            this.viewSingle ? this.singleCardView() : this.multipleCardView(),
            m("div", { class: "live-program-dummy" }) //dummy space
        ]);
    }

    //単一カード表示
    private singleCardView(): Vnode<any, any> {
        if(this.viewModel.getList().length == 0) { return m("div"); }

        let result: Vnode<any, any>[] = [];
        this.viewModel.getList().map((data, index, array) => {
            result.push(this.createCardContent(data));
            if(array.length - 1 > index) { result.push(m("hr", { class: "card-line" } )); }
        })

        return m("div", { class: LiveProgramCardView.cardClassStr }, result);
    }

    //複数カード表示
    private multipleCardView(): Vnode<any, any>[] {
        return this.viewModel.getList().map((data: { [key: string]: any }) => {
            return m("div", { class: LiveProgramCardView.cardClassStr }, [
                this.createCardContent(data)
            ]);
        });
    }

    //1局ごとの番組情報
    private createCardContent(data: { [key: string]: any }): Vnode<any, any> {
        return m("div", {
            class: "mdl-card__supporting-text card-link",
            onclick: () => {
                this.dialogContentViewModel.setup(data["name"], data["type"], data["channel"], data["sid"]);
                this.dialogContentViewModel.configListUpdate();
                this.dialogViewModel.open(LiveProgramCardViewModel.dialogId);
            }
        },[
            m("div", { class: "program-station-name" }, data["name"]),
            m("div", { class: "program-time" }, `${ this.getFormatedDate(data["starttime"]) } ~ ${ this.getFormatedDate(data["endtime"]) }`),
            m("div", { class: "program-title" }, data["title"]),
            m("div", { class: "program-description" }, data["description"])
        ]);
    }

    /**
    * Date を hh:mm 形式に変換する
    * @param date string型
    */
    private getFormatedDate(date: string): string {
        return DateUtil.format(DateUtil.getJaDate(new Date(date)), "hh:mm");
    }
}

namespace LiveProgramCardView {
    export const cardClassStr = "live-program mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col";
}

export default LiveProgramCardView;

