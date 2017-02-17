"use strict";

import * as m from 'mithril';
import ModelFactory from '../ModelFactory/ModelFactory';
import { DialogModelInterface } from '../Model/Dialog/DialogModel';

/**
* Util モジュール
* よく使う処理をまとめたもの
*/
namespace Util {
    //Material Desgin Lite の DOM をアップグレードする処理
    export const upgradeMdl = (): void => {
        componentHandler.upgradeDom();
        let el = document.getElementsByClassName( "mdl-layout__container" );
        for(let i = 0; i < el.length - 1; i++) { el[i].parentNode!.removeChild(el[i]); }
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
        return JSON.parse(JSON.stringify(m.route.param()));
    }

    /**
    * query を文字列に変換する
    * @param query query
    */
    export const buildQueryStr = (query: { [key: string]: any }): string => {
        return m.buildQueryString(query);
    }

    /**
    * 現在のページを取得する
    */
    export const getRoute = (): string => {
        return m.route.get().split("?")[0];
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

    /**
    * page reload
    */
    export const reload = (): void => {
        (<DialogModelInterface>ModelFactory.getInstance().get("DialogModel")).close();
        setTimeout(() => { location.reload(); }, 100);
    }

    /**
    * fake reload
    * query に引数を変更してページを更新し、元のページに戻る
    */
    export const fakeReload = (): void => {
        (<DialogModelInterface>ModelFactory.getInstance().get("DialogModel")).close();

        setTimeout(() => {
            let route = Util.getRoute();
            let query = Util.getCopyQuery();
            query["reload"] = 1;
            m.route.set(route, query);
        }, 100);

        setTimeout(() => { history.back(); }, 500);
    }

    /**
    * 文字列を URL 用に変換する
    * @param str 文字列
    */
    export const encodeURL = (str: string): string => {
        return encodeURI(str)
            .replace(/\;/g, "%3B")
            .replace(/\?/g, "%3F")
            .replace(/\:/g, "%3A")
            .replace(/\@/g, "%40")
            .replace(/\&/g, "%26")
            .replace(/\=/g, "%3D")
            .replace(/\+/g, "%2B")
            .replace(/\$/g, "%24")
            .replace(/\!/g, "%21")
            .replace(/\*/g, "%2A")
            .replace(/\,/g, "%2C")
            .replace(/\(/g, "%28")
            .replace(/\)/g, "%29")
            .replace(/\#/g, "%23")
    }
}

export default Util;

