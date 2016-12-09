"use strict";

import * as m from 'mithril';

/**
* Util モジュール
* よく使う処理をまとめたもの
*/
namespace Util {
    //Material Desgin Lite の DOM をアップグレードする処理
    export const upgradeMdl = (): void => {
        componentHandler.upgradeDom();
        let el = document.getElementsByClassName( "mdl-layout__container" );
        for(let i = 1; i < el.length; i++) {
            el[i].parentNode!.removeChild(el[i]);
        }
    }

    /**
    * 0埋めする
    * @param num 0埋めする数値
    * @param 桁数
    */
    export const strZeroPlus = (num: number, digit: number): string => {
        let zeroStr = "";
        for(let i = 0; i < digit; i++) { zeroStr += "0"; }

        return ( zeroStr + num ).slice(-1 * digit);
    }

    /**
    * header 部分の高さ
    */
    export const getHeaderHeight = (): number => {
        let header = document.getElementsByTagName('header')[0];
        if(header == null) { return 0; }
        return header.clientHeight;
    }

    /**
    * UA が iOS か判定
    */
    export const uaIsiOS = (): boolean => {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    /**
    * UA が Android か判定
    */
    export const uaIsAndroid = (): boolean => {
        return /Android|android/.test(navigator.userAgent);
    }

    /**
    * UA が Edge か判定
    */
    export const uaIsEdge = (): boolean => {
        return /Edge|edge/.test(navigator.userAgent);
    }

    /**
    * UA が Mobile か判定
    */
    export const uaIsMobile = (): boolean => {
        return /Mobile|mobile/.test(navigator.userAgent);
    }

    /**
    * hash size を返す
    * @param hash
    */
    export const hashSize = (object: {}): number => {
        let size = 0;
        for(let prop in object) {
            if(object.hasOwnProperty(prop)) { size++; }
        }

        return size;
    }

    /**
    * query のコピーを返す
    */
    export const getCopyQuery = (): { [key: string]: any } => {
        return JSON.parse(JSON.stringify(m.route.param('')));
    }

    /**
    * title から検索用文字列を生成する
    * epgrec UNA から移植した
    * @param title title
    */
    export const createSearchStr = (title: string): string => {
        let out_title = title.trim();
        let delimiter = " #";
        if(out_title.indexOf(" #") == -1 ) {
            delimiter = out_title.indexOf('「') == -1 ? "" : "「";
        }

        let keyword: string[] = [];
        if( delimiter != "" ){ keyword = out_title.split(delimiter); }
        if( typeof keyword[0] == "undefined" || keyword[0].length == 0 || keyword[0] == "" ) { keyword[0] = out_title; }
        keyword[0] = keyword[0].replace(" ", "%");

        return keyword[0];
    }

    /**
    * hostory api に対応しているかチェックする
    * true: 対応, false: 非対応
    */
    export const isEnableHistory = (): boolean => {
        return history && history.pushState && history.state !== undefined
    }
}

export default Util;

