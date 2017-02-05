"use strict";

import * as m from 'mithril';
import View from '../View';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import KeywordInfoDialogViewModel from '../../ViewModel/Keyword/KeywordInfoDialogViewModel';
import KeywordViewModel from '../../ViewModel/Keyword/KeywordViewModel';
import KeywordDeleteDialogViewModel from '../../ViewModel/Keyword/KeywordDeleteDialogViewModel';

/**
* KeywordInfoDialog の View
*/
class KeywordInfoDialogView extends View {
    private viewModel: KeywordInfoDialogViewModel;
    private keywordViewModel: KeywordViewModel;
    private keywordDeleteDialogViewModel: KeywordDeleteDialogViewModel;
    private dialog: DialogViewModel;

    public execute(): Mithril.VirtualElement {
        this.viewModel = <KeywordInfoDialogViewModel>this.getModel("KeywordInfoDialogViewModel");
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");
        this.keywordViewModel = <KeywordViewModel>this.getModel("KeywordViewModel");
        this.keywordDeleteDialogViewModel = <KeywordDeleteDialogViewModel>this.getModel("KeywordDeleteDialogViewModel");

        let keyword = this.viewModel.getKeyword();
        if(keyword == null) { return m("div", "empty"); }

        let enableText = keyword["kw_enable"] ? "無効化" : "有効化";
        let enableStyle = this.keywordViewModel.getShowStatus() ? "display: none;" : "";

        return m("div", [
            m("div", { class: "keyword-info-dialog-frame" }, [
                m("div", { class: "keyword-info-dialog-title" }, [ "検索語句: ",
                    m("span", { class: "keyword-info-dialog-text" }, keyword["keyword"] )
                ]),

                m("div", { class: "keyword-info-dialog-title" }, [ "オプション: ",
                    m("span", { class: "keyword-info-dialog-text" }, keyword["option"] )
                ]),

                m("div", { class: "keyword-info-dialog-title" }, [ "種別: ",
                    m("span", { class: "keyword-info-dialog-text" }, keyword["types"] )
                ]),

                m("div", { class: "keyword-info-dialog-title" }, [ "局名: ",
                    m("span", { class: "keyword-info-dialog-text" }, keyword["channel_name"] )
                ]),

                m("div", { class: "keyword-info-dialog-title" }, [ "ジャンル: ",
                    m("span", { class: "keyword-info-dialog-text" }, `${ keyword["category_name"] }(${ keyword["subGenre"]  }) `)
                ]),

                m("div", { class: "keyword-info-dialog-title" }, [ "曜日: ",
                    m("span", { class: "keyword-info-dialog-text" }, keyword["weekofdays"] )
                ]),

                m("div", { class: "keyword-info-dialog-title" }, [ "開始時間: ",
                    m("span", { class: "keyword-info-dialog-text" }, [
                        keyword["time"].map((t: string) =>{
                            return t;
                        })
                    ])
                ]),

                m("div", { class: "keyword-info-dialog-title" }, [ "優先度: ",
                    m("span", { class: "keyword-info-dialog-text" }, keyword["priority"] )
                ]),

                m("div", { class: "keyword-info-dialog-title" }, [ "時刻シフト(開始): ",
                    m("span", { class: "keyword-info-dialog-text" }, keyword["sft_start"] )
                ]),

                m("div", { class: "keyword-info-dialog-title" }, [ "時刻シフト(終了): ",
                    m("span", { class: "keyword-info-dialog-text" }, keyword["sft_end"] )
                ]),

                m("div", { class: "keyword-info-dialog-title" }, [ "隣接禁止: ",
                    m("span", { class: "keyword-info-dialog-text" }, keyword["discontinuity"] )
                ]),

                m("div", { class: "keyword-info-dialog-title" }, [ "録画モード: ",
                    m("span", { class: "keyword-info-dialog-text" }, keyword["autorec_mode_name"] )
                ])
            ]),

            m("div", { class: "keyword-info-dialog-buttom-frame" }, [
                //閉じるボタン
                m("button", {
                    class: "hover mdl-button mdl-js-button mdl-button--primary",
                    onclick: () => { this.dialog.close(); }
                }, "閉じる" ),

                //有効無効ボタン
                m("button", {
                    class: "hover mdl-button mdl-js-button mdl-button--primary",
                    style: enableStyle,
                    onclick: () => {
                        //enable keyword
                        this.keywordViewModel.enableKeyword(keyword!["id"], !keyword!["kw_enable"]);
                    }
                }, enableText ),

                //番組一覧ボタン
                m("button", {
                    class: "hover mdl-button mdl-js-button mdl-button--primary",
                    onclick: () => {
                        this.dialog.close();
                        setTimeout( () => { m.route("/recorded", { keyword_id: keyword!["id"] }); }, 300);
                    }
                }, "番組一覧" ),

                //削除ボタン
                m("button", {
                    class: "hover mdl-button mdl-js-button mdl-button--primary",
                    onclick: () => {
                        this.dialog.close();
                        if(keyword!["recordedNum"] > 0) {
                            setTimeout(() => {
                                //open keyword delete dialog
                                this.keywordDeleteDialogViewModel.setup(keyword!);
                                this.dialog.open(KeywordDeleteDialogViewModel.dialogId);
                                m.redraw()
                            }, 400);
                        } else {
                            //delete keyword
                            this.viewModel.deleteKeyword();
                        }
                    }
                }, "削除" ),

                //編集ボタン
                m("button", {
                    class: "hover mdl-button mdl-js-button mdl-button--primary",
                    onclick: () => {
                        this.dialog.close();
                        setTimeout( () => { m.route("/search", { keyword_id: keyword!["id"] }); }, 300);
                    }
                }, "編集" )
            ])
        ]);
    }
}

export default KeywordInfoDialogView;

