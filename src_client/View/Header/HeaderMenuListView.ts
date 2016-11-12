"use strict";

import * as m from 'mithril';
import View from '../View';

/**
* HeaderMenuList 部分の View
* @param id 対応する HeaderMenuIcon の id ( string )
* @param content メニューの中身 ( Mithril.VirtualElement[] )
    * @throw HeaderMenuListView option Error options が正しくない場合発生
*/
class HeaderMenuListView extends View {
    private id: string;
    private content: Mithril.VirtualElement[];

    /**
    * @throw HeaderMenuListView option Error options が正しくない場合発生
    */
    protected checkOptions(): void {
        if(!this.typeCheck("id", "string") || typeof this.options["content"] == "undefined") {
            console.log(this.options);
            throw new Error('HeaderMenuListView option Error');
        }
        this.id = this.options["id"];
        this.content = this.options["content"];
    }

    public execute(): Mithril.VirtualElement {
        return m("ul", {
            class: "mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect",
            for: this.id
        }, [
            this.content.map((data: Mithril.VirtualElement) => {
                return data;
            })
        ])
    }
}

export default HeaderMenuListView;

