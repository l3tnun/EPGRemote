"use strict";

import * as m from 'mithril';
import View from '../View';
import PaginationViewModel from '../../ViewModel/Pagination/PaginationViewModel';
/**
* Pagination View
* @param maxWidth pagination の最大幅を指定する
*/
class PaginationView extends View {
    private maxWidth: number | null = null;
    private viewModel: PaginationViewModel;

    protected checkOptions(): void {
        if(typeof this.options["maxWidth"] != "undefined" && typeof this.options["maxWidth"] == "number") {
            this.maxWidth = this.options["maxWidth"];
        }
    }

    public execute(): Mithril.VirtualElement {
        this.viewModel = <PaginationViewModel>this.getModel("PaginationViewModel");
        let maxWidthStr = (this.maxWidth == null) ? "" : `max-width: ${ this.maxWidth }px;`;

        if(!this.viewModel.showStatus) { return m("div"); }

        return m("div", {
            class: "pagination mdl-card mdl-shadow--2dp mdl-cell mdl-cell mdl-cell--12-col",
            style: maxWidthStr
        }, [
            m("div", { class: "pagination-frame" }, [
                //戻るボタン
                m("a", {
                    class: "pagination-button hover material-icons",
                    href: this.createLink(this.viewModel.prev),
                    config: (element, isInit, context, vdom) => {
                        this.hidden(<HTMLElement>element, this.viewModel.prev);
                        m.route(element, isInit, context, vdom);
                    }
                }, "navigate_before"),

                //ページ名
                m("div", { class: "pagination-text" }, this.viewModel.name ),

                //進むボタン
                m("a", {
                    class: "pagination-button hover material-icons",
                    href: this.createLink(this.viewModel.next),
                    config: (element, isInit, context, vdom) => {
                        this.hidden(<HTMLElement>element, this.viewModel.next);
                        m.route(element, isInit, context, vdom);
                    }
                }, "navigate_next")
            ])
        ]);
    }

    private createLink(page: { [key: string]: any } | null): string {
        if(page == null) { return ""; }
        return page["addr"] + "?" + m.buildQueryString(page["query"]);
    }

    private hidden(element: HTMLElement, page: { [key: string]: any } | null): void {
        element.style.visibility = (page == null) ? "hidden" : "";
    }
}

export default PaginationView;

