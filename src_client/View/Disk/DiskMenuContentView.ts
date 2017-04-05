"use strict";

import * as m from 'mithril';
import { Vnode } from 'mithril';
import View from '../View';
import DiskDialogViewModel from '../../ViewModel/Disk/DiskDialogViewModel';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';

/**
* DiskMenuContent の View
*/
class DiskMenuContentView extends View {
    private dialog: DialogViewModel;
    private viewModel: DiskDialogViewModel;

    public execute(): Vnode<any, any> {
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");
        this.viewModel = <DiskDialogViewModel>this.getModel("DiskDialogViewModel");

        return m("li", {
            class: "mdl-menu__item",
            onclick: () => {
                this.viewModel.update();
                this.dialog.open(DiskDialogViewModel.dialogId);
            }
        }, "ストレージ空き容量")
    }
}

export default DiskMenuContentView;

