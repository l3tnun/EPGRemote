"use strict";

import * as m from 'mithril';
import View from '../View';
import Util from '../../Util/Util';
import DateUtil from '../../Util/DateUtil';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import ProgramInfoDialogViewModel from '../../ViewModel/Program/ProgramInfoDialogViewModel';

/**
* ProgramInfoDialog のView
*/
class ProgramInfoDialogView extends View {
    private dialog: DialogViewModel;
    private viewModel: ProgramInfoDialogViewModel;

    public execute(): Mithril.Vnode<any, any> {
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");
        this.viewModel = <ProgramInfoDialogViewModel>this.getModel("ProgramInfoDialogViewModel");

        if(this.viewModel.getProgram() == null) { return m("div", "empty"); }

        let program: { [key: string]: any } = this.viewModel.getProgram();
        let channel: { [key: string]: any } = this.viewModel.getChannel();

        if(channel == null) { return m("div", "empty"); }

        return m("div", {
            class: "program-dialog-frame",
            oninit: () => { Util.upgradeMdl(); }
        }, [
            m("div", { class: "program-dialog-title" }, program["title"]),
            m("div", { class: "program-dialog-channel" }, channel["name"]),
            m("div", { class: "program-dialog-time" }, this.createTimeStr() ),
            m("div", { class: "program-dialog-description" }, program["description"]),

            m("div", {
                style: "display: table; margin: 0 auto; position: relative; top: -12px;"
            }, [
                this.createPriority(), //優先度

                m("div", { style: "display: table-cell;" }, [
                    //ts削除チェックボックス
                    this.createCheckBox("ts削除",
                        () => { return this.viewModel.deleteFile; },
                        (value: boolean) => { this.viewModel.deleteFile = value; }
                    ),
                    //隣接禁止チェックボックス
                    this.createCheckBox("隣接禁止",
                        () => { return this.viewModel.discontinuity },
                        (value: boolean) => { this.viewModel.discontinuity = value; }
                    ),

                    //録画モード
                    this.createRecMode()
                ])
            ]),

            m("div", { style: "text-align: center; position: relative; top: -30px; height: 0px;" }, [
                this.createRecButton(), //予約ボタン
                this.createAutorecButton(), //自動予約ボタン
                this.createSearch() //検索ボタン
            ])

        ]);
    }

    //番組時間
    private createTimeStr(): string {
        let program: { [key: string]: any } = this.viewModel.getProgram();
        let start = DateUtil.getJaDate(new Date(program["starttime"]));
        let end = DateUtil.getJaDate(new Date(program["endtime"]));

        return `${ DateUtil.format(start, "hh:mm:ss") } ~ ${ DateUtil.format(end, "hh:mm:ss") }`;
    }

    //優先度
    private createPriority(): Mithril.Vnode<any, any>[] {
        let options: Mithril.Vnode<any, any>[] = [];
        for(let i = 20; i > 0; i--) { options.push(m("option", { value: i }, String(i))); }

        return [
            m("div", {
                class: "mdl-checkbox__label program-dialog-label",
                style: "display: table-cell; position: relative; top: -6px;"
            }, [ m("label", "優先") ] ),

            m("div", {
                class: "mdl-textfield mdl-js-textfield",
                style: "width: auto; display: table-cell; top: -7px; padding-left: 8px;"
            }, [
                m("select", {
                    id: "priority_selector",
                    class: "mdl-textfield__input program-dialog-label",
                    value: this.viewModel.priority,
                    onchange: m.withAttr("value", (value) => { this.viewModel.priority = Number(value); })
                }, options)
            ])
        ];
    }

    //チェックボックス生成
    private createCheckBox(label: string, checked: Function, onchange: Function): Mithril.Vnode<any, any> {
        return m("div", {
            style: "display: table-cell; padding-left: 8px;"
        }, [
            m("label", {
                class: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect program-dialog-checkbox"
            }, [
                m("input", {
                    type: "checkbox",
                    class: "mdl-checkbox__input",
                    checked: checked(),
                    onchange: m.withAttr("checked", (value) => { onchange(value) })
                }),
                m("span", {
                    class: "mdl-checkbox__label program-dialog-label"
                }, label)
            ])
        ]);
    }

    //録画モードセレクタ
    private createRecMode(): Mithril.Vnode<any, any> {
        let recMode = this.viewModel.getRecModeList();

        return m("div", {
            style: "position: relative; display: table-cell; top: -7px; padding-left: 8px;"
        }, [
            m("div", {
                class: "mdl-textfield mdl-js-textfield",
                style: "width: auto; display: table-cell; max-width: 68px;"
            }, [
                m("select", {
                    id: "rec_mode_selector",
                    class: "mdl-textfield__input program-dialog-label",
                    value: this.viewModel.recMode,
                    onchange: m.withAttr("value", (value) => { this.viewModel.recMode = Number(value); })
                 },
                 recMode.map((rec: { [key: string]: any }) => {
                     return m("option", { value: rec["id"] }, rec["name"]);
                 }))
            ])
        ])
    }

    //予約ボタン
    private createRecButton(): Mithril.Vnode<any, any> {
        let program = this.viewModel.getProgram();
        let recModeDefaultId = this.viewModel.getRecModeDefaultId();

        if(program["recorded"]) {
            return m("button", {
                class: "mdl-button mdl-js-button mdl-button--primary",
                onclick: () => {
                    this.viewModel.cancelRec();
                }
            }, "予約削除" );
        }

        return m("button", {
            class: "mdl-button mdl-js-button mdl-button--primary",
            onclick: () => {
                if(this.viewModel.priority != 10 || this.viewModel.recMode != recModeDefaultId || this.viewModel.discontinuity || this.viewModel.deleteFile) {
                    //詳細予約
                    this.viewModel.customRec();
                } else {
                    //簡易予約
                    this.viewModel.simpleRec();
                }
            }
        }, "予約" );
    }

    //自動予約ボタン
    private createAutorecButton(): Mithril.Vnode<any, any> {
        let program = this.viewModel.getProgram();

        return  m("button", {
            class: "mdl-button mdl-js-button mdl-button--primary",
            onclick: () => {
                this.viewModel.changeAutoRec();
            }
        }, program["autorec"] == 1 ? "自動予約禁止" : "自動予約許可");
    }

    //検索ボタン
    private createSearch(): Mithril.Vnode<any, any> {
        return m("button", { class: "mdl-button mdl-js-button mdl-button--primary",
            onclick: () => {
                this.dialog.close();
                m.route.set("/search", this.createSearchQuery());
            },
            oncreate: (vnode: Mithril.VnodeDOM<any, any>) => {
                if(Util.getRoute() != "/search") { return; }
                (<HTMLElement>(vnode.dom)).style.display = "none";

            }
        }, "番組検索" )
    }

    private createSearchQuery(): { [key: string]: any } {
        let program = this.viewModel.getProgram();
        if(program["title"] == "") { return {}; };

        return {
            search: Util.createSearchStr(program["title"]),
            type: program["type"],
            channel_id: program["channel_id"],
            category_id: program["category_id"],
            sub_genre: program["sub_genre"]
        }
    }
}

export default ProgramInfoDialogView;

