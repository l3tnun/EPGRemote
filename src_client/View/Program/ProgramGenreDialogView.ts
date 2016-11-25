"use strict";

import * as m from 'mithril';
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
    private storedGenre: { [key: number]: boolean; };

    public execute(): Mithril.VirtualElement {
        this.viewModel = <ProgramStorageViewModel>this.getModel("ProgramStorageViewModel");
        this.programViewModel = <ProgramViewModel>this.getModel("ProgramViewModel");

        this.storedGenre = this.viewModel.get();
        if(this.storedGenre == null) { return m("div", "LocalStorage が無効になっています。"); }

        return m("div", [
            m("ul", {
                class: "mdl-list",
                style: "padding: 16px 16px 0px; margin: 0;",
                config: (_element, _isInit, _context) => {
                    Util.upgradeMdl();
                }
            }, this.createGenreList())
        ]);
    }

    //ジャンルリストを生成
    private createGenreList(): Mithril.VirtualElement[] {
        let genres = this.programViewModel.getGenre();
        if(genres == null) { return [ m("div", "empty") ] }

        return genres.map((genre: { [key: string]: any }) => {
            return m("li", { class: "program-genre-dialog-item mdl-list__item" }, [
                m("span", { class: "mdl-list__item-primary-content" }, genre["name_jp"] ),
                m("span", { class: "program-genre-dialog-toggle mdl-list__item-secondary-action" }, [
                    m("label", {
                        class: "mdl-switch mdl-js-switch mdl-js-ripple-effect",
                        config: (element, _isInit, _context) => {
                            if(this.storedGenre[genre["id"]] && element.className.indexOf("is-checked") == -1) {
                                element.classList.add("is-checked");
                            } else if(!this.storedGenre[genre["id"]] && element.className.indexOf("is-checked") != -1) {
                                element.classList.remove("is-checked");
                            }
                        }
                    }, [
                        m("input", {
                            type: "checkbox",
                            class: "mdl-switch__input",
                            checked: this.storedGenre[genre["id"]],
                            onchange: m.withAttr("checked", (value) => {
                                this.storedGenre[genre["id"]] = value;
                                m.redraw.strategy("none");
                            })
                        })
                    ])
                ])
            ])
        });
    }
}

export default ProgramGenreDialogView;

