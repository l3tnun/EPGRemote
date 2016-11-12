"use strict";

import * as m from 'mithril';
import View from '../View';
import NavigationComponent from '../../Component/Navigation/NavigationComponent';
import HeaderComponent from '../../Component/Header/HeaderComponent';

/**
* TopPage の View
* ページ読み込み時に Navigation を開く
*/
class TopPageView extends View {
    public execute(): Mithril.VirtualElement {
        return m("div", {
            class: "mdl-layout mdl-js-layout mdl-layout--fixed-header",
            config: (_element, isInit, _context) => {
                if(!isInit) {
                    //navigation を開く
                    setTimeout(() => { this.openNavigation(); }, 200);
                }
            }
        }, [
            m.component(new HeaderComponent(), { title: "EPGRemote" }),
            m.component(new NavigationComponent())
        ]);
    }

    //Navigation を開く
    private openNavigation(): void {
        var navi = document.getElementsByClassName("mdl-layout__obfuscator")
        var naviVisible = document.getElementsByClassName("mdl-layout__obfuscator is-visible");
        if(navi.length > 0 && naviVisible.length == 0) {
            let button = <HTMLElement>navi[0];
            button.click();
        }
    }
}

export default TopPageView;

