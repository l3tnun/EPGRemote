"use strict";

import ApiModel from '../ApiModel';
import SubGenreModule from '../../SubGenreModule';
import Sql from '../../../Sql/Sql';

class SearchConfigModel extends ApiModel {
    private getSearchConfigSql: Sql;

    constructor(_getSearchConfigSql: Sql) {
        super();
        this.getSearchConfigSql = _getSearchConfigSql;
    }

    public execute(): void {
        this.getSearchConfigSql.execute(this.option, (rows) => {
            let configJson = this.config.getConfig();
            this.results = {}
            let genres = rows[0];
            let channel = rows[1].concat(rows[2]).concat(rows[3]).concat(rows[4]);
            let recMode = configJson.epgrecConfig.recMode;
            let startTranscodeId = configJson.epgrecConfig.startTranscodeId;
            let recModeDefaultId = configJson.epgrecConfig.recModeDefaultId;
            let subGenres = SubGenreModule.getAllSubGenres();
            let broadcast = configJson.broadcast;

            this.results = {
                genres: genres,
                channel: channel,
                subGenres: subGenres,
                recMode: recMode,
                startTranscodeId: startTranscodeId,
                recModeDefaultId: recModeDefaultId,
                broadcast: broadcast
            }

            this.eventsNotify();
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }
}

export default SearchConfigModel;

