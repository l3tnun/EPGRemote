"use strict";

import * as m from 'mithril';
import View from '../View';
import Util from '../../Util/Util';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import ProgramStorageViewModel from '../../ViewModel/Program/ProgramStorageViewModel';
import ProgramViewModel from '../../ViewModel/Program/ProgramViewModel';

/**
* ProgramGenreDialog の View
*/

class ProgramGenreDialogView extends View {
    private viewModel: ProgramStorageViewModel;
    private dialog: DialogViewModel;
    private programViewModel: ProgramViewModel;
    private storedGenre: { [key: number]: boolean; };

    public execute(): Mithril.VirtualElement {
        this.viewModel = <ProgramStorageViewModel>this.getModel("ProgramStorageViewModel");
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");
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
            }, this.createGenreList()),
            m("hr", { style: "margin: 14px 0 0 0;" }),
            this.createActionButton()
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

    //更新、キャンセルボタン
    public createActionButton(): Mithril.VirtualElement {
         return m("div", { class: "mdl-dialog__actions", style: "height: 36px;" }, [
            //更新ボタン
            m("button", {
                class: "mdl-button mdl-js-button mdl-button--primary",
                onclick: () => {
                    this.dialog.close();
                    this.viewModel.update(this.storedGenre);
                    this.programViewModel.resetCache();
                    this.programViewModel.updateProgram();
                }
            }, "更新"),

            //キャンセルボタン
            m("button", {
                class: "mdl-button mdl-js-button mdl-button--accent",
                onclick: () => {
                    this.dialog.close();
                }
            }, "キャンセル")
        ]);
    }
}

export default ProgramGenreDialogView;

