"use strict";

import EpgrecOperater from './EpgrecOperater';

class CustomRecEpgrecOperater extends EpgrecOperater {
    public execute(option: { [key: string]: any }, callback: (value: string) => void, errCallback: (value: { [key: string]: any }) => void): void {
        this.log.system.info('CustomRecEpgrecOperater was called');

        let url = `${this.hostUrl}/customReservation.php`;

        this.httpPost(url, option, `CustomRecEpgrecOperater`, callback, errCallback);
    }
}

export default CustomRecEpgrecOperater;

