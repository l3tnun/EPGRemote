"use strict";

import * as m from 'mithril';
import View from '../View';

/**
* HeaderMenuIcon 部分の View
* @param _id menu を識別するために必要な id (string)
* @throw HeaderMenuIconView option Error options が正しくない場合発生
*/
class HeaderMenuIconView extends View {
    private id: string;

    /**
    * @throw HeaderMenuIconView option Error options が正しくない場合発生
    */
    protected checkOptions(): void {
        if(!this.typeCheck("id", "string")) {
            console.log(this.options);
            throw new Error('HeaderMenuIconView option Error');
        }
        this.id = this.options["id"];
    }

    public execute(): Mithril.Vnode<any, any> {
        return m("label", {
            id: this.id,
            class: "header_menu_button"
        }, [
            m("i", { class: "material-icons" }, "more_vert")
        ]);
    }
}

export default HeaderMenuIconView;

