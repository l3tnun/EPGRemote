"use strict";

/**
* Date 型の形式変換を行う
* DateFormat.format(new Date(), "yyyy MM/dd hh:mm:ss (w)") のような形で
* "2016 01/01 12:00:00 (日)" のような結果が帰ってくる
*/
namespace DateUtil {
    const fmt = {
        yyyy: (date: Date): string => { return date.getFullYear() + ''; },
        MM: (date: Date): string => { return ('0' + (date.getMonth() + 1)).slice(-2); },
        dd: (date: Date): string => { return ('0' + date.getDate()).slice(-2); },
        hh: (date: Date): string => { return ('0' + date.getHours()).slice(-2); },
        mm: (date: Date): string => { return ('0' + date.getMinutes()).slice(-2); },
        ss: (date: Date): string => { return ('0' + date.getSeconds()).slice(-2); },
        w: (date: Date): string => { return ["日", "月", "火", "水", "木", "金", "土"][date.getDay()]; },
    }

    export const format = (date: Date, formatStr: string): string => {
        for (let key in fmt) {
            formatStr = formatStr.replace(key, fmt[key](date));
        }

        return formatStr;
    }

    //日本時間に変換する
    export const getJaDate = (localDate: Date): Date => {
        let offSet = (localDate.getTimezoneOffset() * 60 * 1000 ) + ( 1000 * 60 * 60 * 9 );
        return new Date( localDate.getTime() + offSet );
    }

    /**
    * Date の時差を返す (date1 - date2) ミリ秒
    * @param date1
    * @param date2
    */
    export const dateDiff = (date1: Date, date2: Date): number => {
        return Math.floor(date1.getTime() - date2.getTime());
    }
}

export default DateUtil;

