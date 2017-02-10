"use strict";

import * as m from 'mithril';
import View from '../View';
import Util from '../../Util/Util';
import ReservationDeleteDialogContentViewModel from '../../ViewModel/Reservation/ReservationDeleteDialogContentViewModel';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';

class ReservationDeleteDialogContentView extends View {
    private viewModel: ReservationDeleteDialogContentViewModel;
    private dialog: DialogViewModel;

    public execute(): Mithril.Vnode<any, any> {
        this.viewModel = <ReservationDeleteDialogContentViewModel>this.getModel("ReservationDeleteDialogContentViewModel");
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");

        let program = this.viewModel.program;
        if(program == null) { return m("div", "empty"); }

        return m("div", [
            m("div", { class: "reservation_delete_dialog_content" }, program["title"] + "を削除しますか。"),

            m("label", { class: "reservation-autorec-checkbox mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect"}, [
                m("input", {
                    type: "checkbox",
                    class: "mdl-checkbox__input",
                    checked: this.viewModel.deleteCheckBox,
                    onchange: m.withAttr("checked", (value) => { this.viewModel.deleteCheckBox = value; }),
                    oncreate: () => { this.checkboxInit(); },
                    onupdate: (vnode: Mithril.VnodeDOM<any, any>) => { this.checkboxConfig(<HTMLInputElement>(vnode.dom)); }
                }),
                m("span", { class: "mdl-checkbox__label" }, "自動予約禁止")
            ]),

            m("div", { class: "mdl-dialog__actions" }, [
                m("button", {
                    class: "mdl-button mdl-js-button mdl-button--primary",
                    oncreate: () => { Util.upgradeMdl(); },
                    onclick: () => {
                        if(program == null) { return; }
                        this.viewModel.deleteProgram(program["id"]);
                    }
                }, "削除" ),
                m("button", {
                    class: "mdl-button mdl-js-button mdl-button--accent",
                    onclick: () => { this.dialog.close(); }
                }, "キャンセル" )
            ])
        ]);
    }
}

export default ReservationDeleteDialogContentView;

