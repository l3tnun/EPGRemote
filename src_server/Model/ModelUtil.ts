"use strict";

namespace ModelUtil {
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

export default ModelUtil;

