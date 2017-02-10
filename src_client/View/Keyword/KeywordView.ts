"use strict";

import * as m from 'mithril';
import ParentPageView from '../ParentPageView';
import Util from '../../Util/Util';
import PaginationComponent from '../../Component/Pagination/PaginationComponent';
import PaginationViewModel from '../../ViewModel/Pagination/PaginationViewModel';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import KeywordViewModel from '../../ViewModel/Keyword/KeywordViewModel';
import KeywordInfoDialogComponent from '../../Component/Keyword/KeywordInfoDialogComponent';
import KeywordInfoDialogViewModel from '../../ViewModel/Keyword/KeywordInfoDialogViewModel';
import KeywordDeleteDialogComponent from '../../Component/Keyword/KeywordDeleteDialogComponent';
import KeywordDeleteDialogViewModel from '../../ViewModel/Keyword/KeywordDeleteDialogViewModel';

/**
* Keyword の View
*/
class KeywordView extends ParentPageView {
    private viewModel: KeywordViewModel;
    private paginationViewModel: PaginationViewModel;
    private dialog: DialogViewModel;
    private keywordInfoDialogViewModel: KeywordInfoDialogViewModel;

    private paginationComponent = new PaginationComponent();
    private keywordInfoDialogComponent = new KeywordInfoDialogComponent();
    private keywordDeleteDialogComponent = new KeywordDeleteDialogComponent();

    public execute(): Mithril.Vnode<any, any> {
        this.viewModel = <KeywordViewModel>this.getModel("KeywordViewModel");
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");
        this.keywordInfoDialogViewModel = <KeywordInfoDialogViewModel>this.getModel("KeywordInfoDialogViewModel");
        this.paginationViewModel = <PaginationViewModel>this.getModel("PaginationViewModel");

        //Pagintion setup
        this.paginationViewModel.setup(this.viewModel.getKeywordLimit(), this.viewModel.getKeywordTotalNum());

        return m("div", {
            class: "mdl-layout mdl-js-layout mdl-layout--fixed-header",
            oncreate: () => { this.viewModel.resize(); },
            onupdate: () => { this.viewModel.resize(); }
        }, [
            this.createHeader("自動録画のキーワード管理"),
            this.createHeaderMenu(),
            this.createNavigation(),

            this.mainLayout([
                this.mainView(),
                m(this.paginationComponent, {
                    maxWidth: 800
                }),
                m("div", { style: "height: 20px;" }) //dummy
            ]),

            //keyword info dialog
            m(this.getDialogComponent(KeywordInfoDialogViewModel.dialogId), {
                id: KeywordInfoDialogViewModel.dialogId,
                width: 400,
                content: m(this.keywordInfoDialogComponent)
            }),

            //keyword delete dialog
            m(this.getDialogComponent(KeywordDeleteDialogViewModel.dialogId), {
                id: KeywordDeleteDialogViewModel.dialogId,
                width: 400,
                content: m(this.keywordDeleteDialogComponent)
            }),

            //ディスク空き容量ダイアログ
            this.createDiskDialog(),

            //snackbar
            this.createSnackbar()
        ]);
    }

    //カード表示と表表示を切り替え
    private mainView(): Mithril.Vnode<any, any>[] {
        if(this.viewModel.getShowStatus() == null) { return []; }

        if(this.viewModel.getShowStatus()) {
            return this.createCardView();
        } else {
            return [ this.createTableView() ];
        }
    }

    //カード表示
    private createCardView(): Mithril.Vnode<any, any>[] {
        return this.viewModel.getKeywords().map((keyword: { [key: string]: any }) => {
            return this.createCardContent(keyword);
        });
    }

    //カードの中身
    private createCardContent(keyword: { [key: string]: any }): Mithril.Vnode<any, any> {
        return m("div", {
            class: "keyword-card mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col",
            oncreate: () => { Util.upgradeMdl(); },
            onupdate: () => { Util.upgradeMdl(); },
            onclick: (e: Event) => {
                if((<HTMLElement>e.target).className.indexOf("mdl-switch") != -1) { return; }
                //open keyword info dialog
                this.keywordInfoDialogViewModel.setup(keyword);
                this.dialog.open(KeywordInfoDialogViewModel.dialogId);
            }
        }, [
            m("div", { class: "mdl-card__supporting-text" }, [
                m("div", { class: "keyword-card-title" }, keyword["keyword"]),
                m("label", {
                    class: "keyword-card-toggle mdl-switch mdl-js-switch mdl-js-ripple-effect",
                    onupdate: (vnode: Mithril.VnodeDOM<any, any>) => {
                        //toggle の設定
                        if(keyword["kw_enable"] && vnode.dom.className.indexOf("is-checked") == -1) {
                            vnode.dom.classList.add("is-checked");
                        } else if(!keyword["kw_enable"] && vnode.dom.className.indexOf("is-checked") != -1) {
                            vnode.dom.classList.remove("is-checked");
                        }
                    }
                }, [
                    //有効化 toogle
                    m("input", {
                        type: "checkbox", class: "mdl-switch__input",
                        checked: keyword["kw_enable"],
                        onchange: m.withAttr("checked", (value) => {
                            if(keyword["kw_enable"] == value) { value = !value } //firefox で発生する
                            this.viewModel.enableKeyword(keyword["id"], value);
                        }),
                    }),
                    m("span", { class: "mdl-switch__label" })
                ])
            ])
        ]);
    }

    //表表示
    private createTableView(): Mithril.Vnode<any, any> {
        let keywords = this.viewModel.getKeywords();
        if(keywords.length == 0) { return m("div"); }

        return m("table", { class: "keyword-list mdl-data-table mdl-js-data-table mdl-shadow--2dp" }, [
            m("thead", [
                m("tr", [
                    m("th", { class: "keyword-list-title-th mdl-data-table__cell--non-numeric" }, "検索語句"),
                    m("th", { class: "keyword-list-title-th mdl-data-table__cell--non-numeric" }, "オプション"),
                    m("th", { class: "keyword-list-title-th mdl-data-table__cell--non-numeric" }, "種別"),
                    m("th", { class: "keyword-list-title-th mdl-data-table__cell--non-numeric" }, "局名"),
                    m("th", { class: "keyword-list-title-th mdl-data-table__cell--non-numeric" }, "ジャンル"),
                    m("th", { class: "keyword-list-title-th mdl-data-table__cell--non-numeric" }, "サブジャンル"),
                    m("th", { class: "keyword-list-title-th mdl-data-table__cell--non-numeric" }, "日付"),
                    m("th", { class: "keyword-list-title-th mdl-data-table__cell--non-numeric" }, "時刻"),
                    m("th", { class: "keyword-list-title-th mdl-data-table__cell--non-numeric" }, "優先"),
                    m("th", { class: "keyword-list-title-th mdl-data-table__cell--non-numeric" }, "時刻シフト"),
                    m("th", { class: "keyword-list-title-th mdl-data-table__cell--non-numeric" }, "隣接"),
                    m("th", { class: "keyword-list-title-th mdl-data-table__cell--non-numeric" }, "録画"),
                ])
            ]),

            //content
            m("tbody",
                keywords.map((keyword: { [key: string]: any }) => {
                    return this.createTableContent(keyword);
                })
            )
        ]);
    }

    //表の中身
    private createTableContent(keyword: { [key: string]: any }): Mithril.Vnode<any, any> {
        let option = keyword["option"].split(":");
        let listAddClass = keyword["kw_enable"] ? "" : "keyword-list-disable";

        return m("tr", {
            class: listAddClass,
            onclick: () => {
                //open keyword info dialog
                this.keywordInfoDialogViewModel.setup(keyword);
                this.dialog.open(KeywordInfoDialogViewModel.dialogId);
            }
        }, [
            m("th", { class: "keyword-list-th keyword-list-keyword mdl-data-table__cell--non-numeric" }, keyword["keyword"]),
            m("th", { class: "keyword-list-th keyword-list-option mdl-data-table__cell--non-numeric" }, [
                m("div", option[0]),
                m("div", option[1])
            ]),
            m("th", { class: "keyword-list-th keyword-list-types mdl-data-table__cell--non-numeric" }, keyword["types"]),
            m("th", { class: "keyword-list-th keyword-list-channel-name mdl-data-table__cell--non-numeric" }, keyword["channel_name"]),
            m("th", { class: "keyword-list-th keyword-list-category-name mdl-data-table__cell--non-numeric" }, keyword["category_name"]),
            m("th", { class: "keyword-list-th keyword-list-sub-genre mdl-data-table__cell--non-numeric" }, keyword["subGenre"]),
            m("th", { class: "keyword-list-th keyword-list-weekofdays mdl-data-table__cell--non-numeric" }, keyword["weekofdays"]),
            m("th", { class: "keyword-list-th keyword-list-time mdl-data-table__cell--non-numeric" },[
                keyword["time"].map((t: string) => {
                    return m("div", t);
                })
            ]),
            m("th", { class: "keyword-list-th mdl-data-table__cell--non-numeric" }, keyword["priority"]),
            m("th", { class: "keyword-list-th mdl-data-table__cell--non-numeric" }, [
                m("div", keyword["sft_start"]),
                m("div", keyword["sft_end"])
            ]),
            m("th", { class: "keyword-list-th mdl-data-table__cell--non-numeric" }, keyword["discontinuity"]),
            m("th", { class: "keyword-list-th keyword-list-rec-mode mdl-data-table__cell--non-numeric" }, keyword["autorec_mode_name"])
        ]);
    }
}

export default KeywordView;

