"use strict";

import * as m from 'mithril';
import View from '../View';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import ProgramStorageViewModel from '../../ViewModel/Program/ProgramStorageViewModel';
import ProgramViewModel from '../../ViewModel/Program/ProgramViewModel';

/**
* ProgramGenreDialogAction の View
*/

class ProgramGenreDialogActionView extends View {
    private viewModel: ProgramStorageViewModel;
    private dialog: DialogViewModel;
    private programViewModel: ProgramViewModel;
    private storedGenre: { [key: number]: boolean; };

    public execute(): Mithril.Vnode<any, any> {
        this.viewModel = <ProgramStorageViewModel>this.getModel("ProgramStorageViewModel");
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");
        this.programViewModel = <ProgramViewModel>this.getModel("ProgramViewModel");

        this.storedGenre = this.viewModel.get();
        if(this.storedGenre == null) { return m("div", ""); }

        return m("div", [
            m("hr", { style: "margin: 0;" }),
            this.createActionButton()
        ]);
    }

    //更新、キャンセルボタン
    public createActionButton(): Mithril.Vnode<any, any> {
         return m("div", { class: "mdl-dialog__actions", style: "height: 36px;" }, [
            //更新ボタン
            m("button", {
                class: "mdl-button mdl-js-button mdl-button--primary",
                onclick: () => {
                    this.dialog.close();
                    this.viewModel.update();
                    this.programViewModel.resetCache();
                    this.programViewModel.updateProgram();
                }
            }, "更新"),

            //キャンセルボタン
            m("button", {
                class: "mdl-button mdl-js-button mdl-button--accent",
                onclick: () => {
                    this.dialog.close();
                }
            }, "キャンセル")
        ]);
    }
}

export default ProgramGenreDialogActionView;

