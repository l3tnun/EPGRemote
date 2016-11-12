"use strict";

import EpgrecOperater from './EpgrecOperater';

class EPGSingleUpdateEpgrecOperater extends EpgrecOperater {
    public execute(option: { [key: string]: any }, callback: (value: string) => void, errCallback: (value: { [key: string]: any }) => void, timeoutCallback?: (value: { [key: string]: any }) => void): void {
        this.log.system.info('EPGSingleUpdateEpgrecOperater was called');

        let channel_disc = option["channel_disc"];

        if(typeof channel_disc == "undefined") {
            errCallback({ code: 415 });
            return;
        }

        let url = `${this.hostUrl}/scoutEpg.php?disc=${channel_disc}&mode=1`;

        this.httpGet(url, `EPGSingleUpdateEpgrecOperater ${ channel_disc }`, callback, errCallback, timeoutCallback);
    }
}

export default EPGSingleUpdateEpgrecOperater;

