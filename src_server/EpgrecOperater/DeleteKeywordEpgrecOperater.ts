"use strict";

import EpgrecOperater from './EpgrecOperater';

class DeleteKeywordEpgrecOperater extends EpgrecOperater {
    public execute(option: { [key: string]: any }, callback: (value: string) => void, errCallback: (value: { [key: string]: any }) => void): void {
        this.log.system.info('DeleteKeywordEpgrecOperater was called');

        let keyword_id = option["keyword_id"];

        if(typeof keyword_id == "undefined") {
            errCallback({ code: 415 });
            return;
        }

        let url = `${this.hostUrl}/deleteKeyword.php?keyword_id=${keyword_id}`;

        this.httpGet(url, `DeleteKeywordEpgrecOperater ${ keyword_id }`, callback, errCallback);
    }
}

export default DeleteKeywordEpgrecOperater;

