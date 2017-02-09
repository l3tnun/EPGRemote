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
    private headerComponent = new HeaderComponent();
    private navigationComponent = new NavigationComponent();

    public execute(): Mithril.Vnode<any, any> {
        return m("div", {
            class: "mdl-layout mdl-js-layout mdl-layout--fixed-header",
            oncreate: () => { setTimeout(() => { this.openNavigation(); }, 200); },
        }, [
            m(<Mithril.Component<{ title: string; }, {}>>this.headerComponent, { title: "EPGRemote" }),
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
}

export default TopPageView;

