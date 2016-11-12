"use strict";

import EpgrecOperater from './EpgrecOperater';

class CancelReservationEpgrecOperater extends EpgrecOperater {
    public execute(option: { [key: string]: any }, callback: (value: string) => void, errCallback: (value: { [key: string]: any }) => void): void {
        this.log.system.info('CancelReservationEpgrecOperater was called');

        let rec_id = option["rec_id"];
        let autorec = option["autorec"];

        if(typeof rec_id == "undefined" || typeof autorec == "undefined") {
            errCallback({ code: 415 });
            return;
        }

        let url = `${this.hostUrl}/cancelReservation.php?reserve_id=${ rec_id }&autorec=${ autorec }`;

        this.httpGet(url, `CancelReservationEpgrecOperater ${ rec_id } ${ autorec }`, callback, errCallback);
    }
}

export default CancelReservationEpgrecOperater;

