"use strict";

import * as m from 'mithril';
import SearchOptionBaseView from './SearchOptionBaseView';
import SearchViewModel from '../../ViewModel/Search/SearchViewModel';

/**
* SearchOption の View
*/
class SearchOptionView extends SearchOptionBaseView {
    private viewModel: SearchViewModel;

    public execute(): Mithril.Vnode<any, any> {
        this.viewModel = <SearchViewModel>this.getModel("SearchViewModel");

        return m("div", { class: "search-option-card mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col" }, [
            m("div", { class: "mdl-card__supporting-text" }, [
                this.createKeyword(),
                this.createBroadcaster(),
                this.createGenres(),
                this.createTimes()
            ]),
            this.createActionButtons()
        ]);
    }

    //キーワード部分
    private createKeyword(): Mithril.Vnode<any, any> {
        return this.createContentFrame("キーワード", [
            m("div", { class: "search-option-text-box mdl-cell--12-col mdl-textfield mdl-js-textfield" }, [
                 m("input", {
                    class: "mdl-textfield__input",
                    type: "text",
                    value: this.viewModel.keyword,
                    onchange: m.withAttr("value", (value) => { this.viewModel.keyword = value; }),
                    onupdate: (vnode: Mithril.VnodeDOM<any, any>) => {
                         //enter key で検索
                        (<HTMLInputElement>vnode.dom).onkeydown = (e) => {
                            if(e.keyCode == 13) {
                                this.viewModel.keyword = (<HTMLInputElement>vnode.dom).value;
                                this.viewModel.search();
                                (<HTMLInputElement>vnode.dom).blur();
                            }
                        }
                    }
                })
            ]),

            m("div", {
                class: "mdl-cell mdl-cell--12-col mdl-grid mdl-grid--no",
                style: "clear:both; padding: 0;"
            }, [
                this.createCheckBox(
                    "正規表現",
                    () => { return this.viewModel.useRegexp; },
                    (value: boolean) => { this.viewModel.useRegexp = value; }
                ),
                this.createCheckBox(
                    "全半角同一視",
                    () => { return this.viewModel.collateCi; },
                    (value: boolean) => { this.viewModel.collateCi = value; }
                ),
                this.createCheckBox(
                    "タイトル",
                    () => { return this.viewModel.enableTitle; },
                    (value: boolean) => { this.viewModel.enableTitle = value; }
                ),
                this.createCheckBox(
                    "概要",
                    () => { return this.viewModel.enableDescription; },
                    (value: boolean) => { this.viewModel.enableDescription = value; }
                )
            ])
        ])
    }

    //放送局
    private createBroadcaster(): Mithril.Vnode<any, any> {
        return this.createContentFrame("放送局", [
            //放送局プルダウン
            m("div", { style: "display: flex; width: 100%;" }, [
                 m("div", { class: "pulldown mdl-layout-spacer" }, [
                    m("select", {
                        value: this.viewModel.channelValue,
                        onchange: m.withAttr("value", (value) => { this.viewModel.channelValue = Number(value); })
                    }, [
                        m("option", { value: 0 }, "すべて"),
                        this.viewModel.getChannel().map((channel: { [key: string]: any }) => {
                            return m("option", { value: channel["id"] }, channel["name"]);
                        })
                    ])
                ])
            ]),

            m("div", {
                class: "mdl-cell mdl-cell--12-col mdl-grid mdl-grid--no",
                style: "clear:both; margin-top: 12px; padding: 0;"
            }, this.createBroadCastCheckBox())

        ]);
    }

    //放送波のチェックボックス生成
    private createBroadCastCheckBox(): Mithril.Vnode<any, any>[] {
        let broadcast = this.viewModel.getBroadcast();
        let result: Mithril.Vnode<any, any>[] = [];

        if(broadcast["GR"]) { result.push(
            this.createCheckBox(
                "GR",
                () => { return this.viewModel.typeGR; },
                (value: boolean) => { this.viewModel.typeGR = value; })
            )
        }
        if(broadcast["BS"]) { result.push(
            this.createCheckBox(
                "BS",
                () => { return this.viewModel.typeBS; },
                (value: boolean) => { this.viewModel.typeBS = value; })
            )
        }
        if(broadcast["CS"]) { result.push(
            this.createCheckBox(
                "CS",
                () => { return this.viewModel.typeCS; },
                (value: boolean) => { this.viewModel.typeCS = value; })
            )
        }
        if(broadcast["EX"]) { result.push(
            this.createCheckBox(
                "EX",
                () => { return this.viewModel.typeEX; },
                (value: boolean) => { this.viewModel.typeEX = value; })
            )
        }

        return result;
    }

    //対象ジャンル
    private createGenres(): Mithril.Vnode<any, any> {
        return this.createContentFrame("対象ジャンル", [
            //ジャンルセレクタ
            m("div", { style: "display: flex; width: 50%; float: left;" }, [
                m("div", { class: "pulldown mdl-layout-spacer" }, [
                    m("select", {
                        value: this.viewModel.genreValue,
                        onchange: m.withAttr("value", (value) => {
                            this.viewModel.genreValue = Number(value);
                            this.viewModel.isInitSubGenre = false;
                        })
                    },
                        m("option", { value: 0 }, "すべて"),
                        this.viewModel.getGenres().map((genres: { [key: string]: any }) => {
                            return m("option", { value: genres["id"] }, genres["name_jp"] );
                        })
                    )
                ])
            ]),

            //サブジャンルセレクタ
            m("div", { style: "display: flex; width: 50%;" }, [
                m("div", { class: "pulldown mdl-layout-spacer" }, [
                    m("select", {
                        value: this.viewModel.subGenreValue,
                        onchange: m.withAttr("value", (value) => { this.viewModel.subGenreValue = value; })
                    },
                        this.createSubGenreOption()
                    )
                ])
            ]),

            m("div", {
                class: "mdl-cell mdl-cell--12-col mdl-grid mdl-grid--no",
                style: "clear:both; margin-top: 12px; padding: 0;"
            }, [
                this.createCheckBox(
                    "全保持",
                    () => { return this.viewModel.firstGenre },
                    (value: boolean) => { this.viewModel.firstGenre = value; }
                )
            ])
        ]);
    }

    //サブジャンルセレクタの中身を生成
    private createSubGenreOption(): Mithril.Vnode<any, any>[] {
        let result: Mithril.Vnode<any, any>[] = [];
        let subGenres = this.viewModel.getSubGenre()[this.viewModel.genreValue];

        for(let id in subGenres) {
            if(subGenres[id] == "すべて") {
                result.unshift( m("option", { value: id }, subGenres[id]) );
                if(!this.viewModel.isInitSubGenre) {
                    this.viewModel.isInitSubGenre = true;
                    this.viewModel.subGenreValue = Number(id);
                    setTimeout(() => { m.redraw(); }, 0);
                }
            } else {
                result.push( m("option", { value: id }, subGenres[id]) );
            }
        }

        return result;
    }

    //対象時刻
    private createTimes(): Mithril.Vnode<any, any> {
        return this.createContentFrame("対象時刻", [
            //開始時刻セレクタ
            m("div", { style: "display: flex; width: float: left;" }, [
                m("div", { class: "pulldown mdl-layout-spacer" }, [
                    m("select", {
                        value: this.viewModel.programTimeValue,
                        onchange: m.withAttr("value", (value) => {
                            this.viewModel.programTimeValue = Number(value)
                        })
                    }, this.createProgramTimeOption() )
                ])
            ]),

            m("div", {
                style: "display: flex; width: float: left; padding: 0px 12px; font-size: 16px; margin-top: 12.5px;"
            }, "から"),

            //時刻幅セレクタ
            m("div", { style: "display: flex;" }, [
                m("div", { class: "pulldown mdl-layout-spacer" }, [
                    m("select", {
                        value: this.viewModel.periodValue,
                        onchange: m.withAttr("value", (value) => { this.viewModel.periodValue = value; } )
                    }, [
                        this.createPeriodOption()
                    ])
                ])
            ]),

            //曜日チェックボックス
            m("div", {
                class: "mdl-cell mdl-cell--12-col mdl-grid mdl-grid--no",
                style: "clear:both; margin-top: 12px; padding: 0;"
            }, [
                this.createCheckBox(
                    "月",
                    () => { return this.viewModel.week0; },
                    (value: boolean) => { this.viewModel.week0 = value; }
                ),
                this.createCheckBox(
                    "火",
                    () => { return this.viewModel.week1; },
                    (value: boolean) => { this.viewModel.week1 = value; }
                ),
                this.createCheckBox(
                    "水",
                    () => { return this.viewModel.week2; },
                    (value: boolean) => { this.viewModel.week2 = value; }
                ),
                this.createCheckBox(
                    "木",
                    () => { return this.viewModel.week3; },
                    (value: boolean) => { this.viewModel.week3 = value; }
                ),
                this.createCheckBox(
                    "金",
                    () => { return this.viewModel.week4; },
                    (value: boolean) => { this.viewModel.week4 = value; }
                ),
                this.createCheckBox(
                    "土",
                    () => { return this.viewModel.week5; },
                    (value: boolean) => { this.viewModel.week5 = value; }
                ),
                this.createCheckBox(
                    "日",
                    () => { return this.viewModel.week6; },
                    (value: boolean) => { this.viewModel.week6 = value; }
                ),
            ])
        ]);
    }

    //開始時刻セレクタの中身を生成
    public createProgramTimeOption():  Mithril.Vnode<any, any>[] {
        let result = [ m("option", { value: 24 }, "なし") ];
        for(let i = 0; i < 24; i++) { result.push( m("option", { value: i }, `${ i }時`) ) }

        return result;
    }

    //時刻幅セレクタの中身
    public createPeriodOption():  Mithril.Vnode<any, any>[] {
        let result: Mithril.Vnode<any, any>[] = [];
        for(let i = 1; i < 24; i++) { result.push( m("option", { value: i }, i + "時間") ); }
        return result;
    }

    //アクションボタン
    public createActionButtons(): Mithril.Vnode<any, any> {
        return m("div", { class: "mdl-dialog__actions mdl-card__actions mdl-card--border" }, [
            //検索ボタン
            m("button", {
                class: "no-hover mdl-button mdl-js-button mdl-button--primary",
                onclick: () => { setTimeout(() => { this.viewModel.search(); }, 500); }
            }, "検索" ),

            //キャンセル or 元に戻すボタン
            m("button", {
                class: "no-hover mdl-button mdl-js-button mdl-button--accent",
                onclick: () => {
                    this.viewModel.initSearchOption(); //search option 初期化
                    this.viewModel.initAddKeywordOption(); //add keyword option 初期化
                    this.viewModel.searchResultInit(); //検索結果を初期化

                    if(typeof m.route.param("keyword_id") != "undefined") {
                        this.viewModel.setSearchOptionFromKeyword(); //keyword id から search option をセット
                        this.viewModel.setAddKeywordOptionFromKeyword(); //keyword id から add keyword option をセット
                    }
                }
            }, "クリア")
        ]);
    }
}

export default SearchOptionView;

