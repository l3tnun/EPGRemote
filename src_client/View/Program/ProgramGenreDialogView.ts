"use strict";

import * as m from 'mithril';
import { Vnode, VnodeDOM } from 'mithril';
import View from '../View';
import Util from '../../Util/Util';
import ProgramStorageViewModel from '../../ViewModel/Program/ProgramStorageViewModel';
import ProgramViewModel from '../../ViewModel/Program/ProgramViewModel';

/**
* ProgramGenreDialog の View
*/

class ProgramGenreDialogView extends View {
    private viewModel: ProgramStorageViewModel;
    private programViewModel: ProgramViewModel;

    public execute(): Vnode<any, any> {
        this.viewModel = <ProgramStorageViewModel>this.getModel("ProgramStorageViewModel");
        this.programViewModel = <ProgramViewModel>this.getModel("ProgramViewModel");

        if(this.viewModel.get() == null) { return m("div", "LocalStorage が無効になっています。"); }

        return m("div", [
            m("ul", {
                class: "mdl-list",
                style: "padding: 16px; margin: 0;",
                onupdate: () => { Util.upgradeMdl(); }
            }, this.createGenreList())
        ]);
    }

    //ジャンルリストを生成
    private createGenreList(): Vnode<any, any>[] {
        let genres = this.programViewModel.getGenre();
        if(genres == null || this.viewModel.tmpGenre == null) { return [ m("div", "empty") ] }

        return genres.map((genre: { [key: string]: any }) => {
            return m("li", { class: "program-genre-dialog-item mdl-list__item" }, [
                m("span", { class: "mdl-list__item-primary-content" }, genre["name_jp"] ),
                m("span", { class: "program-genre-dialog-toggle mdl-list__item-secondary-action" }, [
                    m("label", {
                        class: "mdl-switch mdl-js-switch mdl-js-ripple-effect",
                        onupdate: (vnode: VnodeDOM<any, any>) => {
                            if(this.viewModel.tmpGenre == null) { return; }
                            if(this.viewModel.tmpGenre[genre["id"]] && vnode.dom.className.indexOf("is-checked") == -1) {
                                vnode.dom.classList.add("is-checked");
                            } else if(!this.viewModel.tmpGenre[genre["id"]] && vnode.dom.className.indexOf("is-checked") != -1) {
                                vnode.dom.classList.remove("is-checked");
                            }
                        }
                    }, [
                        m("input", {
                            type: "checkbox",
                            class: "mdl-switch__input",
                            checked: this.viewModel.tmpGenre![genre["id"]],
                            onchange: m.withAttr("checked", (value) => {
                                if(this.viewModel.tmpGenre![genre["id"]] == value) { value = !value } //firefox で発生する
                                this.viewModel.tmpGenre![genre["id"]] = value;
                            })
                        })
                    ])
                ])
            ])
        });
    }
}

export default ProgramGenreDialogView;

