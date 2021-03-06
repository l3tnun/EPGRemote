"use strict";

import * as m from 'mithril';
import { Vnode, VnodeDOM } from 'mithril';
import View from '../View';

/**
* Search Option と Add Keyword のベースクラス
*/
abstract class SearchOptionBaseView extends View {
    protected createContentFrame(name: string, content: Vnode<any, any>[]): Vnode<any, any> {
        return m("div", {
            class: "search-option-content mdl-cell mdl-cell--12-col mdl-grid mdl-grid--no-spacing"
        }, [
            m("div", {
                class: "search-option-title mdl-cell mdl-cell--3-col mdl-cell--2-col-tablet"
        }, name),
            m("div", {
                class: "mdl-cell mdl-cell--6-col mdl-cell--9-col-desktop mdl-grid mdl-grid--no-spacing"
            }, content)
        ]);
    }

    //チェックボックス生成
    protected createCheckBox(labelName: string, checked: Function, onchange: Function): Vnode<any, any> {
        return m("label", { class: "search-option-checkbox mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" }, [
            m("input", {
                type: "checkbox",
                class: "mdl-checkbox__input",
                checked: checked(),
                onchange: m.withAttr("checked", (value) => { onchange(value); }),
                oncreate: () => { this.checkboxInit(); },
                onupdate: (vnode: VnodeDOM<any, any>) => {
                    this.checkboxConfig(<HTMLInputElement>(vnode.dom));
                }
            }),
            m("span", { class: "mdl-checkbox__label" }, labelName )
        ]);
    }
}

export default SearchOptionBaseView;

