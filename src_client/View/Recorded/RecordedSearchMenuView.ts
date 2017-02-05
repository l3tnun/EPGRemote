"use strict";

import * as m from 'mithril';
import View from '../View';
import Util from '../../Util/Util';
import RecordedSearchMenuViewModel from '../../ViewModel/Recorded/RecordedSearchMenuViewModel';

class RecordedSearchMenuView extends View {
    private viewModel: RecordedSearchMenuViewModel;

    public execute(): Mithril.VirtualElement {
        this.viewModel = <RecordedSearchMenuViewModel>this.getModel("RecordedSearchMenuViewModel");

        return m("div", [
            //dummy link
            m("a", { id: RecordedSearchMenuView.dummyLinkId, style: "display: none" }, "search_dummy" ),

            //search menu frame
            m("div", {
                id: "recorded-search-frame",
                class: "mdl-shadow--2dp",
                style: this.viewModel.getShowStatus() ? `top: ${ Util.getHeaderHeight() }px;` : ""
            }, [
                this.createSearchTextField(), //検索テキストフィールド
                this.createKeywordSelector(), //キーワード
                this.createChannelSelector(), //放送局
                this.createCategorySelector(), //ジャンル
                this.createActionButtons() //検索ボタン等
            ]),

            //背景
            m("div", {
                id: "recorded-search-background",
                style: this.viewModel.getShowStatus() ? "display: block;" : "",
                onclick: () => { this.viewModel.changeShowStatus(); }
            })
        ]);
    }

    //search text field を生成する
    private createSearchTextField(): Mithril.VirtualElement {
        return m("div", { class: "recorded-search-textfield mdl-textfield mdl-js-textfield" }, [
            //search textfield
            m("input", {
                class: "mdl-textfield__input", id: "recorded_search", type: "text",
                value: this.viewModel.search,
                onchange: m.withAttr("value", (value) => {
                    this.viewModel.search = value;
                    this.viewModel.categoryUpdate();
                    this.viewModel.channelUpdate();
                }),
                config: (element, isInit, _context) => {
                    if(isInit) { return; }
                    //enter key で検索
                    (<HTMLInputElement>element).onkeydown = (e) => {
                        if(e.keyCode == 13) {
                            this.viewModel.search = (<HTMLInputElement>element).value;
                            this.search();
                            (<HTMLInputElement>element).blur();
                        }
                    }
                }
            })
        ]);
    }

    //keyword selector
    private createKeywordSelector(): Mithril.VirtualElement[] {
        return [
            m("div", "自動録画キーワード"),
            m("div", { class: "pulldown mdl-layout-spacer", style: "width: 100%;" }, [
                m("select", {
                    value: this.viewModel.keyword_id,
                    onchange: m.withAttr("value", (value) => {
                        this.viewModel.keyword_id = Number(value);
                        this.viewModel.search = ""; //search init
                        this.viewModel.category_id = -1; //category init
                        this.viewModel.channel_id = -1; //channel init
                        this.viewModel.categoryUpdate();
                        this.viewModel.channelUpdate();
                    }),
                    config: (element, isInit, context) => {
                        this.selectConfig(<HTMLInputElement>element, isInit, context, this.viewModel.keyword_id);
                    }
                }, [
                    m("option", { value: -1 }, "自動キーワード選択"),
                    this.viewModel.getKeyword().map((data: { [key: string]: any }) => {
                        return m("option", { value: data["id"] }, `${ data["name"] }`);
                    })
                ])
            ])
        ]
    }

    //放送局 selector
    private createChannelSelector(): Mithril.VirtualElement[] {
        return [
            m("div", { style: "margin-top: 10px;" }, "放送局"),
            m("div", { class: "pulldown mdl-layout-spacer", style: "width: 100%;" }, [
                m("select", {
                    value: this.viewModel.channel_id,
                    onchange: m.withAttr("value", (value) => {
                        this.viewModel.channel_id = Number(value);
                        if(this.viewModel.channel_id == -1) { this.viewModel.channelUpdate(); }
                        if(this.viewModel.category_id == -1) {  this.viewModel.categoryUpdate(); }
                    }),
                    config: (element, isInit, context) => {
                        this.selectConfig(<HTMLInputElement>element, isInit, context, this.viewModel.channel_id);
                    }
                }, [
                    m("option", { value: -1 }, "すべて"),
                    this.viewModel.getChannel().map((data: { [key: string]: any }) => {
                        return m("option", { value: data["id"] }, `${ data["name"] }(${ data["count"] })`);
                    })
                ])
            ])
        ];
    }

    //ジャンル selector
    private createCategorySelector(): Mithril.VirtualElement[] {
        return [
            m("div", { style: "margin-top: 10px;" }, "ジャンル"),
            m("div", { class: "pulldown mdl-layout-spacer", style: "width: 100%;" }, [
                m("select", {
                    value: this.viewModel.category_id,
                    onchange: m.withAttr("value", (value) => {
                        this.viewModel.category_id = Number(value);
                        if(this.viewModel.channel_id == -1) { this.viewModel.channelUpdate(); }
                        if(this.viewModel.category_id == -1) {  this.viewModel.categoryUpdate(); }
                    }),
                    config: (element, isInit, context) => {
                        this.selectConfig(<HTMLInputElement>element, isInit, context, this.viewModel.category_id);
                    }
                }, [
                    m("option", { value: -1 }, "すべて"),
                    this.viewModel.getCategory().map((data: { [key: string]: any }) => {
                        return m("option", { value: data["id"] }, `${ data["name"] }(${ data["count"] })`);
                    })
                ])
            ])
        ];
    }

    //アクションボタン
    private createActionButtons(): Mithril.VirtualElement {
        return m("div", {
            class: "mdl-dialog__actions mdl-card__actions mdl-card--border",
            style: "margin-top: 12px; border-top: none;"
        }, [
            //検索ボタン
            m("button", {
                class: "mdl-button mdl-button--colored mdl-js-button mdl-button--primary mdl-js-ripple-effect",
                onclick: () => { this.search() }
            }, "検索"),

            //キャンセルボタン
            m("button", {
                class: "mdl-button mdl-button--colored mdl-js-button mdl-button--accent mdl-js-ripple-effect",
                onclick: () => { this.viewModel.changeShowStatus(); }
            }, "キャンセル"),

            m("div", { class: "mdl-layout-spacer" }),

            //リセットボタン
            m("button", {
                class: "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect",
                style: "margin-left: -25px;",
                onclick: () => { this.viewModel.resetQuery(); }
            }, "リセット" )
        ]);
    }

    //入力された情報から検索を実行する
    private search(): void {
        let query = this.viewModel.createQuery();

        let limit = Util.getCopyQuery()["limit"];
        if(typeof limit != "undefined") { query["limit"] = limit; }

        //検索 m.route では戻るときに初期ページが記憶されないため dummy link をクリックして移動する
        let dummySearch = document.getElementById(RecordedSearchMenuView.dummyLinkId)!;
        let href = location.hash.split("?")[0];
        if(Util.hashSize(query) != 0) { href += "?" + m.buildQueryString(query); }
        (<HTMLBaseElement>dummySearch).href = href;
        dummySearch.click();
        this.viewModel.changeShowStatus();
    }
}

namespace RecordedSearchMenuView {
    export const dummyLinkId = "recorded_search_dummy_link";
}

export default RecordedSearchMenuView;

