"use strict";

import * as m from 'mithril';
import { Vnode } from 'mithril';
import View from '../View';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import KeywordDeleteDialogViewModel from '../../ViewModel/Keyword/KeywordDeleteDialogViewModel';

/**
* KeywordDeleteDialog の View
*/
class KeywordDeleteDialogView extends View {
    private viewModel: KeywordDeleteDialogViewModel;
    private dialog: DialogViewModel;

    public execute(): Vnode<any, any> {
        this.viewModel = <KeywordDeleteDialogViewModel>this.getModel("KeywordDeleteDialogViewModel");
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");

        let keyword = this.viewModel.getKeyword();
        if(keyword == null) { return m("div", "empty"); }

        return m("div", [
            m("div", {
                class: "keyword-delete-dialog-title"
            }, `${ keyword["keyword"] } に関連する録画データが残っていますが、削除しますか?` ),

            m("div", { class: "mdl-dialog__actions" }, [
                //削除ボタン
                m("button", { class: "mdl-button mdl-js-button mdl-button--primary",
                    onclick: () => {
                        //delete keyword
                        this.viewModel.deleteKeyword();
                    }
                }, "削除"),

                //キャンセルボタン
                m("button", {
                    class: "mdl-button mdl-js-button mdl-button--accent",
                    onclick: () => { this.dialog.close(); }
                }, "キャンセル")
            ])
        ]);
    }
}

export default KeywordDeleteDialogView;

