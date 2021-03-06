"use strict";

import EpgrecOperater from './EpgrecOperater';

class CancelRecEpgrecOperater extends EpgrecOperater {
    public execute(option: { [key: string]: any }, callback: (value: string) => void, errCallback: (value: { [key: string]: any }) => void): void {
        this.log.system.info('CancelRecEpgrecOperater was called');

        let program_id = option["program_id"];
        let autorec = option["autorec"];

        if(typeof program_id == "undefined" || typeof autorec == "undefined") {
            errCallback({ code: 415 });
            return;
        }

        let url = `${this.hostUrl}/cancelReservation.php?program_id=${ program_id }&autorec=${ autorec }`;

        this.httpGet(url, `CancelRecEpgrecOperater ${ program_id }`, callback, errCallback);
    }
}

export default CancelRecEpgrecOperater;

