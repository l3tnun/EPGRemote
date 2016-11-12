"use strict";

namespace FileTypeModule {
    export const types = {
        ".css"  : "text/css",
        ".js"   : "text/javascript",
        ".ts"   : "video/mpeg",
        ".mp4"  : "video/mp4",
        ".m3u8" : "video/MP2T",
        ".jpg"  : "image/jpg",
        ".png"  : "image/png",
        ".gif"  : "image/gif",
        ".eot"  : "application/vnd.ms-fontobject",
        ".ttf"  : "application/font-ttf",
        ".woff" : "application/font-woff",
        ".woff2": "application/font-woff2",
        ".map": "magnus-internal/imagemap"
    }

    export const hasType = (extension: string): boolean => {
        return extension in types;
    }
}

export default FileTypeModule;

