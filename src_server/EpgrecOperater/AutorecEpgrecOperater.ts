"use strict";

import EpgrecOperater from './EpgrecOperater';

class AutorecEpgrecOperater extends EpgrecOperater {
    public execute(option: { [key: string]: any }, callback: (value: string) => void, errCallback: (value: { [key: string]: any }) => void): void {
        this.log.system.info('AutorecEpgrecOperater was called');

        let program_id = option["program_id"];
        let autorec = option["autorec"];

        if(typeof program_id == "undefined" || typeof autorec == "undefined") {
            errCallback({ code: 415 });
            return;
        }

        let url = `${this.hostUrl}/toggleAutorec.php?program_id=${program_id}&bef_auto=${autorec}`;

        this.httpGet(url, `AutorecEpgrecOperater ${ program_id } : ${ autorec }`, callback, errCallback);
    }
}

export default AutorecEpgrecOperater;

