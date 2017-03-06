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

    protected checkboxInit(): void {
        Util.upgradeMdl();
    }

    protected checkboxConfig(element: HTMLInputElement): void {
        if(element.checked && (<Element>element.parentNode).className.indexOf("is-checked") == -1 ) {
            (<Element>element.parentNode).classList.add('is-checked');
        } else if(!element.checked && (<Element>element.parentNode).className.indexOf("is-checked") != -1) {
            (<Element>element.parentNode).classList.remove('is-checked');
        }
    }

    protected selectConfig(element: HTMLInputElement, value: number): void {
        if(Number(element.value) != value) {
            element.value = String(value);
        }
    }

    /**
    * ふわっと表示させる
    */
    protected addShowAnimetion(element: Element): void {
        setTimeout(() => {
            (<HTMLElement>element).style.opacity = "1";
        }, 250);
    }

    protected hideAnimetion(element: Element): void {
        (<HTMLElement>element).style.opacity = "0";
    }
}

export default View;

