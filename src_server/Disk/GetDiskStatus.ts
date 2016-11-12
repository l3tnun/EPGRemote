"use strict";

import * as child_process from 'child_process';

interface GetDiskStatusInterface {
    execute(diskPath: string, callback: (error: string, stdout: string, stderr: string) => void): void;
}

/**
* 指定されたディレクトリのサイズ、使用済み容量、使用可能容量を返す (GB)
*/
class GetDiskStatus implements GetDiskStatusInterface {
    /**
    * diskPath で指定されたディレクトリのサイズ、使用済み容量、使用可能容量を返す (GB)
    * @param diskPath ディレクトリパス
    * @param callback error, stdout, stderr に df コマンドの実行結果が格納される
    */
    public execute(diskPath: string, callback: (error: string, stdout: string, stderr: string) => void): void {
        child_process.exec(`df --block-size=1024M ${ diskPath } | awk -v OFS=, 'NR == 2 {print $2, $3, $4;}'`, callback);
    }
}

export { GetDiskStatusInterface, GetDiskStatus };

