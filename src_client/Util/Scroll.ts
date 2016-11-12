"use strict";

/**
* Scroll モジュール
*/
namespace Scroll {
    /**
    * 指定した Element を start から end までスクロールさせる
    * @param object Element
    * @param start 開始位置
    * @param end 終了位置
    */
    export const scrollTo = (object: Element, start: number, end: number): void => {
        let time = Math.abs(end - start);
        if(time < 800)  { time = 200; }
        if(time > 800) { time = 800; }
        let cnt = 16;

        for(let i = 1; i <= time + cnt; i += cnt) {
            ((i) => {
                setTimeout(() => {
                    let top = (end - start) / time * i + start;
                    object.scrollTop = Math.round(top);
                }, i);
            })(i);
        }
    }

}

export default Scroll;

