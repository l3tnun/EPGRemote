"use strict";

import * as m from 'mithril';
import View from '../View';
import ReservationMenuViewModel from '../../ViewModel/Reservation/ReservationMenuViewModel';
import MenuViewModel from '../../ViewModel/Menu/MenuViewModel';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import ReservationDeleteDialogContentViewModel from '../../ViewModel/Reservation/ReservationDeleteDialogContentViewModel';

class ReservationMenuContentView extends View {
    public execute(): Mithril.Vnode<any, any> {
        let viewModel = <ReservationMenuViewModel>this.getModel("ReservationMenuViewModel");
        let menuViewModel = <MenuViewModel>this.getModel("MenuViewModel");
        let dialog = <DialogViewModel>this.getModel("DialogViewModel");
        let deleteDialogContent = <ReservationDeleteDialogContentViewModel>this.getModel("ReservationDeleteDialogContentViewModel");

        let program = viewModel.program;

        return m("div", [
            m("div", {
                id: "recorded_menu_edit",
                style: (program != null && program["autorec"] == 0) ? "display: none;" : "",
                class: "menu-item",
                onclick: () => {
                    if(program != null) {
                        m.route.set("/search", { keyword_id: program["autorec"] });
                    }
                    menuViewModel.close();
                }
            }, [
                m("i", { class: "menu-icon material-icons" }, "edit" ),
                m("div", { class: "menu-text" }, "edit")
            ]),
            m("div", {
                class: "menu-item",
                onclick: () => {
                    if(program != null) {
                        deleteDialogContent.setup(program);
                        dialog.open(ReservationDeleteDialogContentViewModel.dialogId);
                    }
                    menuViewModel.close();
                }
            }, [
                m("i", { class: "menu-icon material-icons" }, "delete" ),
                m("div", { class: "menu-text" }, "delete")
            ])
        ]);
    }
}

export default ReservationMenuContentView;

