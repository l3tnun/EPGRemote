"use strict";

import MithrilBase from '../MithrilBase';
import Util from '../Util/Util';

/**
* View 抽象クラス
* execute で描画される
*/
abstract class View extends MithrilBase {
    //Mithril へ渡される部分
    public abstract execute(): Mithril.Vnode<any,any>

    //TODO
    /*protected checkboxConfig(element: HTMLInputElement, isInit: boolean, _context: Mithril.Context): void {
        if(!isInit) {  Util.upgradeMdl(); }
        if(element.checked && (<Element>element.parentNode).className.indexOf("is-checked") == -1 ) {
            (<Element>element.parentNode).classList.add('is-checked');
        } else if(!element.checked && (<Element>element.parentNode).className.indexOf("is-checked") != -1) {
            (<Element>element.parentNode).classList.remove('is-checked');
        }
    }

    protected selectConfig(element: HTMLInputElement, _isInit: boolean, _context: Mithril.Context, value: number): void {
        if(Number((<HTMLInputElement>element).value) != value) {
            (<HTMLInputElement>element).value = String(value);
        }
    }*/

    /**
    * ふわっと表示させる
    */
    /*protected addShowAnimetion(element: Element, isInit: boolean): void {
        if(!isInit) {
            setTimeout(() => {
                (<HTMLElement>element).style.opacity = "1";
            }, 100);
        }
    }*/
}

export default View;

