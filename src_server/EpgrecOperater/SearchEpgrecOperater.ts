"use strict";

import EpgrecOperater from './EpgrecOperater';

class SearchEpgrecOperater extends EpgrecOperater {
    public execute(option: { [key: string]: any }, callback: (value: string) => void, errCallback: (value: { [key: string]: any }) => void): void {
        this.log.system.info('SearchEpgrecOperater was called');

        let url = `${this.hostUrl}/epgremote/searchJson.php`;

        this.httpPost(url, option, `SearchEpgrecOperater`, callback, errCallback);
    }
}

export default SearchEpgrecOperater;

