"use strict";

import * as m from 'mithril';
import SearchOptionBaseView from './SearchOptionBaseView';
import Util from '../../Util/Util';
import SearchViewModel from '../../ViewModel/Search/SearchViewModel';

/**
* SearchAddKeyword の View
*/
class SearchAddKeywordView extends SearchOptionBaseView {
    private viewModel: SearchViewModel;

    public execute(): Mithril.VirtualElement {
        this.viewModel = <SearchViewModel>this.getModel("SearchViewModel");

        //検索結果非表示
        if(!this.viewModel.resultShowStatus) { return m("div"); }

        return m("div", {
            class: "search-option-card mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col",
            style: "margin: 38px auto;",
            config: (_element, _isInit, _context) => { Util.upgradeMdl(); }
        }, [
            m("div", { class: "mdl-card__supporting-text" }, [
                this.createOptionCheckBox(),
                this.createTimeShift(),
                this.createRecMode(),
                this.createSaveDirectory(),
                this.createFileNameFormat(),
                this.createTransCode()
            ]),
            this.createActionButons()
        ]);
    }

    //オプション部分
    private createOptionCheckBox(): Mithril.VirtualElement {
        return this.createContentFrame("オプション", [
            m("div", { style: "margin-left: -12px;" } , [
                this.createCheckBox(
                    "自動予約",
                    () => { return this.viewModel.keywordEnable; },
                    (value: boolean) => { this.viewModel.keywordEnable = value; }
                ),
                this.createCheckBox(
                    "多重予約許可",
                    () => { return this.viewModel.overlap; },
                    (value: boolean) => { this.viewModel.overlap = value; }
                ),
                this.createCheckBox(
                    "無該当警告",
                    () => { return this.viewModel.restAlert; },
                    (value: boolean) => { this.viewModel.restAlert = value; }
                ),
                this.createCheckBox(
                    "時間量変動警告",
                    () => { return this.viewModel.criterionDura; },
                    (value: boolean) => { this.viewModel.criterionDura = value; }
                ),
                this.createCheckBox(
                    "隣接禁止",
                    () => { return this.viewModel.discontinuity; },
                    (value: boolean) => { this.viewModel.discontinuity = value; }
                )
            ])
        ]);
    }

    //時刻シフト
    private createTimeShift():  Mithril.VirtualElement {
        return this.createContentFrame("時刻シフト", [
            //開始シフト
            m("div", { style: "margin-right: 14px;" }, [
                m("div", { class: "search-result-sft-title" }, "開始"),
                m("div", { class: "search-result-sft-input mdl-textfield mdl-js-textfield" }, [
                    m("input", { class: "mdl-textfield__input", type: "text",
                        value: this.viewModel.sftStart,
                        onchange: m.withAttr("value", (value) => { this.viewModel.sftStart = Number(value); })
                    }),
                ]),
                m("div", { class: "search-result-sft-text" }, "分"),
            ]),

            //終了シフト
            m("div", { style: "margin-right: 14px;" }, [
                m("div", { class: "search-result-sft-title" }, "終了"),
                m("div", { class: "search-result-sft-input mdl-textfield mdl-js-textfield" }, [
                    m("input", { class: "mdl-textfield__input", type: "text",
                        value: this.viewModel.sftEnd,
                        onchange: m.withAttr("value", (value) => { this.viewModel.sftEnd = Number(value); })
                    }),
                ]),
                m("div", { class: "search-result-sft-text" }, "分"),
            ]),

            //分割
            m("div", { style: "margin-right: 14px;" }, [
                m("div", { class: "search-result-sft-title" }, "分割"),
                m("div", { class: "search-result-sft-input mdl-textfield mdl-js-textfield" }, [
                    m("input", { class: "mdl-textfield__input", type: "text",
                        value: this.viewModel.splitTime,
                        onchange: m.withAttr("value", (value) => { this.viewModel.splitTime = Number(value); })
                    }),
                ]),
                m("div", { class: "search-result-sft-text" }, "分"),
            ]),

            //優先度
            m("div", [
                m("div", { class: "search-result-sft-title" }, "優先度"),
                m("div", { class: "search-result-sft-input mdl-textfield mdl-js-textfield" }, [
                    m("input", { class: "mdl-textfield__input", type: "text", pattern: "-?[0-9]*(\.[0-9]+)?",
                        value: this.viewModel.priority,
                        onchange: m.withAttr("value", (value) => { this.viewModel.priority = Number(value); })
                    })
                ])
            ])
        ]);
    }

    //録画モード
    private createRecMode(): Mithril.VirtualElement {
        return this.createContentFrame("録画モード", [
            //録画モード
            m("div", [
                m("div", { style: "display: table-cell;" }, "モード"),
                m("div", { style: "display: table-cell; padding: 0px 12px;" }, [
                    m("div", { class: "pulldown mdl-layout-spacer" }, [
                        m("select", {
                            value: this.viewModel.autorecMode,
                            onchange: m.withAttr("value", (value) => { this.viewModel.autorecMode = Number(value); }),
                            config: (element, isInit, context) => {
                                this.selectConfig(<HTMLInputElement>element, isInit, context, this.viewModel.autorecMode);
                            }
                        },
                            this.createRecModeOption(0)
                        )
                    ])
                ])
            ])
        ]);
    }

    //保存ディレクトリ
    private createSaveDirectory(): Mithril.VirtualElement {
        return this.createContentFrame("保存ディレクトリ", [
            m("div", { class: "search-result-text-box mdl-cell--12-col mdl-textfield mdl-js-textfield" }, [
                m("input", { class: "mdl-textfield__input", type: "text",
                    value: this.viewModel.directory,
                    onchange: m.withAttr("value", (value) => { this.viewModel.directory = value; })
                })
            ])
        ]);
    }

    //録画ファイル名の形式
    private createFileNameFormat(): Mithril.VirtualElement {
        return this.createContentFrame("録画ファイル名の形式", [
            m("div", { class: "search-result-text-box mdl-cell--12-col mdl-textfield mdl-js-textfield" }, [
                m("input", { class: "mdl-textfield__input", type: "text",
                    value: this.viewModel.filenameFormat,
                    onchange: m.withAttr("value", (value) => { this.viewModel.filenameFormat = value; })
                })
            ])
        ]);
    }

    //トランスコード
    private createTransCode(): Mithril.VirtualElement {
        if(this.viewModel.getStartTranscodeId() == null) { return m("div"); }

        return this.createContentFrame("トランスコード", [
            this.createTranscodeContent(0),
            this.createTranscodeContent(1),
            this.createTranscodeContent(2),
            this.createCheckBox(
                "元ファイルの自動削除",
                () => { return this.viewModel.tsDelete; },
                (value: boolean) => { this.viewModel.tsDelete = value; }
            )
        ]);
    }

    //トランスコードのセレクタ、text inout を生成する
    private createTranscodeContent(num: number): Mithril.VirtualElement {
        let startTranscodeId = this.viewModel.getStartTranscodeId();

        return m("div", { style: "width: 100%;" }, [
            //セレクタ
            m("div", { style: "display: table-cell;" }, `設定${ num + 1 }: モード`),
            m("div", { style: "display: table-cell; padding: 0px 12px;" }, [
                m("div", { class: "pulldown mdl-layout-spacer" }, [
                    m("select", {
                        value: this.viewModel.transConfig[num]["mode"],
                        onchange: m.withAttr("value", (value) => {
                            this.viewModel.transConfig[num]["mode"] = Number(value);
                        }),
                        config: (element, isInit, context) => {
                            this.selectConfig(<HTMLInputElement>element, isInit, context, this.viewModel.transConfig[num]["mode"]);
                        }
                    }, [
                        m("option", { value: 0 }, "未指定"),
                        this.createRecModeOption(startTranscodeId)
                    ])
                ])
            ]),

            //保存ディレクトリ
            m("div", { class: "search-result-text-box mdl-cell--12-col mdl-textfield mdl-js-textfield" }, [
                m("input", { class: "mdl-textfield__input", type: "text",
                    value: this.viewModel.transConfig[num]["dir"],
                    onchange: m.withAttr("value", (value) => {
                        this.viewModel.transConfig[num]["dir"] = value;
                    })
                })
            ])
        ]);
    }

    /**
    * 録画モードのセレクタのオプションを生成する
    * @param startId 開始 id
    */
    private createRecModeOption(startId: number): Mithril.VirtualElement[] {
        let result: Mithril.VirtualElement[] = [];
        this.viewModel.getRecMode().map((recMode: { [key: string]: any }) => {
            if(recMode["id"] >= startId) {
                result.push( m("option", { value: recMode["id"] }, recMode["name"]) );
            }
        });

        return result;
    }

    //アクションボタン
    private createActionButons(): Mithril.VirtualElement {
        return m("div", { class: "mdl-dialog__actions mdl-card__actions mdl-card--border" }, [
            //追加 or 更新ボタン
            m("button", {
                class: "mdl-button mdl-js-button mdl-button--primary",
                onclick: () => {
                    this.viewModel.addKeyword();
                }
            }, (typeof m.route.param("keyword_id") == "undefined") ? "追加" : "自動キーワードの更新" ),

            //キャンセルボタン
            m("button", {
                class: "mdl-button mdl-js-button mdl-button--accent",
                onclick: () => {
                    //1 つ前のページに戻る
                    window.history.back();
                }
            }, "キャンセル")
        ]);
    }
}

export default SearchAddKeywordView;

