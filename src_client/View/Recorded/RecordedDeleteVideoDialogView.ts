"use strict";

import * as m from 'mithril';
import View from '../View';
import RecordedMenuViewModel from '../../ViewModel/Recorded/RecordedMenuViewModel';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import RecordedDeleteVideoViewModel from '../../ViewModel/Recorded/RecordedDeleteVideoViewModel';

class RecordedDeleteVideoDialogView extends View {
    public execute(): Mithril.VirtualElement {
        let viewModel = <RecordedDeleteVideoViewModel>this.getModel("RecordedDeleteVideoViewModel");
        let dialog = <DialogViewModel>this.getModel("DialogViewModel");
        let program = (<RecordedMenuViewModel>this.getModel("RecordedMenuViewModel")).program;
        if(program == null) { return m("div", "empty"); }

        return m("div", [
            m("div", { class: "recorded-delete-video-dialog-content" }, program["title"] + "を削除しますか。"),
            m("div", { class: "mdl-dialog__actions" }, [
                m("button", {
                    class: "mdl-button mdl-js-button mdl-button--primary",
                    onclick: () => {
                        //delete video
                        viewModel.deleteVideo(program!["id"]);
                        dialog.close();
                    }
                }, "削除"),
                m("button", {
                    class: "mdl-button mdl-js-button mdl-button--accent",
                    onclick: () => { dialog.close(); }
                }, "キャンセル" ),
            ])
        ]);
    }
}

export default RecordedDeleteVideoDialogView;
