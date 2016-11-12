"use strict";

import EpgrecOperater from './EpgrecOperater';

class DeleteVideoEpgrecOperater extends EpgrecOperater {
    public execute(option: { [key: string]: any }, callback: (value: string) => void, errCallback: (value: { [key: string]: any }) => void): void {
        this.log.system.info('DeleteVideoEpgrecOperater was called');

        let rec_id = option["rec_id"];
        let delete_file = option["delete_file"];

        if(typeof rec_id == "undefined" || typeof delete_file == "undefined") {
            errCallback({ code: 415 });
            return;
        }

        let url = `${this.hostUrl}/cancelReservation.php?reserve_id=${rec_id}&delete_file=${delete_file}&db_clean=1`;

        this.httpGet(url, `DeleteVideoEpgrecOperater ${ rec_id } ${ delete_file }`, callback, errCallback);
    }
}

export default DeleteVideoEpgrecOperater;

