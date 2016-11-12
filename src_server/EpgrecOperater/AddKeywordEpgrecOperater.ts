"use strict";

import EpgrecOperater from './EpgrecOperater';

class AddKeywordEpgrecOperater extends EpgrecOperater {
    public execute(option: { [key: string]: any }, callback: (value: string) => void, errCallback: (value: { [key: string]: any }) => void): void {
        this.log.system.info('AddKeywordEpgrecOperater was called');

        let url = `${this.hostUrl}/keywordTable.php`;

        this.httpPost(url, option, `AddKeywordEpgrecOperater`, callback, errCallback);
    }
}

export default AddKeywordEpgrecOperater;

