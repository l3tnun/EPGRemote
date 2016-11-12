"use strict";

namespace SqlUtil {
    export const getOffset = (num: number, limit: number): number => {
        if(num <= 1) { return 0; } else { return (num - 1) * limit; }
    }
}

export default SqlUtil

