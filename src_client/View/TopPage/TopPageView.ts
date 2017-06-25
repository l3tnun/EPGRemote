"use strict";

import * as m from 'mithril';
import { Vnode } from 'mithril';
import View from '../View';
import Util from '../../Util/Util';
import NavigationComponent from '../../Component/Navigation/NavigationComponent';
import HeaderComponent from '../../Component/Header/HeaderComponent';

/**
* TopPage の View
* ページ読み込み時に Navigation を開く
*/
class TopPageView extends View {
    private headerComponent = new HeaderComponent();
    private navigationComponent = new NavigationComponent();
    private setMobile = false;

    public execute(): Vnode<any, any> {
        return m("div", {
            class: "mdl-layout mdl-js-layout mdl-layout--fixed-header",
            oncreate: () => {
                setTimeout(() => { this.openNavigation(); }, 200);
                this.setMobileHead();
            },
            onupdate: () => { this.setMobileHead(); }
        }, [
            m(this.headerComponent, { title: "EPGRemote" }),
            m(this.navigationComponent)
        ]);
    }

    //Navigation を開く
    private openNavigation(): void {
        let navi = document.getElementsByClassName("mdl-layout__obfuscator")
        let naviVisible = document.getElementsByClassName("mdl-layout__obfuscator is-visible");
        if(navi.length > 0 && naviVisible.length == 0) {
            let button = <HTMLElement>navi[0];
            button.click();
        }
    }

    //head に mobile-web-app-capable を追加する
    private setMobileHead(): void {
        if(typeof m.route.param("mobile") == "undefined" || this.setMobile) { return; }
        let meta = document.createElement("meta");
        meta.setAttribute("name", Util.uaIsiOS() ? "apple-mobile-web-app-capable" : "mobile-web-app-capable");
        meta.setAttribute("content", "yes");
        document.getElementsByTagName("head")[0].appendChild(meta);
        this.setMobile = true;
    }
}

export default TopPageView;

