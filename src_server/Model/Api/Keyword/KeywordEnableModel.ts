"use strict";

import ApiModel from '../ApiModel';
import Sql from '../../../Sql/Sql';
import EpgrecOperater from '../../../EpgrecOperater/EpgrecOperater'

class KeywordEnableModel extends ApiModel {
    private getKeywordByIdSql: Sql;
    private addKeywordEpgrecOperater: EpgrecOperater;

    constructor(
        _getKeywordByIdSql: Sql,
        _addKeywordEpgrecOperater: EpgrecOperater
    ) {
        super();
        this.getKeywordByIdSql = _getKeywordByIdSql;
        this.addKeywordEpgrecOperater = _addKeywordEpgrecOperater;
    }


    public execute(): void {
        if(typeof this.option["keyword_id"] == "undefined" || typeof this.option["status"] == "undefined") {
            this.errors = 415;
            this.eventsNotify();
            return;
        }

        this.getKeywordByIdSql.execute(this.option, (rows) => {
            let keyword = rows[0];
            let status = this.option["status"];

            let ts_del = 0;
            let trans = rows[1];
            let transConfig: { mode: string, dir: string }[] = [];

            for(let i = 0; i < 3; i++) {
                if(typeof trans[i] == "undefined") {
                    transConfig.push({ mode: "", dir: "" });
                } else {
                    ts_del = trans[i].ts_del;
                    transConfig.push({
                        mode: trans[i].mode,
                        dir: trans[i].dir.toString('UTF-8')
                    });
                }
            }

            let operetarOption = {
                add_keyword: "1",
                keyword_id:         this.option["keyword_id"],
                k_use_regexp:       keyword[0].use_regexp,
                k_collate_ci:       keyword[0].collate_ci,
                k_ena_title:        keyword[0].ena_title,
                k_ena_desc:         keyword[0].ena_desc,
                k_search:           keyword[0].keyword,
                k_typeGR:           keyword[0].typeGR,
                k_typeBS:           keyword[0].typeBS,
                k_typeCS:           keyword[0].typeCS,
                k_typeEX:           keyword[0].typeEX,
                k_category:         keyword[0].category_id,
                k_station:          keyword[0].channel_id,
                k_weekofday:        keyword[0].weekofdays,
                k_prgtime:          keyword[0].prgtime,
                k_period:           keyword[0].period,
                k_sub_genre:        keyword[0].sub_genre,
                k_first_genre:      keyword[0].first_genre,
                k_criterion_dura:   keyword[0].criterion_dura,
                k_sft_start:        keyword[0].sft_start,
                k_sft_end:          keyword[0].sft_end,
                autorec_mode:       keyword[0].autorec_mode,
                k_priority:         keyword[0].priority,
                k_split_time:       keyword[0].split_time,
                k_directory:        keyword[0].directory,
                k_filename:         keyword[0].filename_format,
                k_trans_mode0:      transConfig[0].mode,
                k_transdir0:        transConfig[0].dir,
                k_trans_mode1:      transConfig[1].mode,
                k_transdir1:        transConfig[1].dir,
                k_trans_mode2:      transConfig[2].mode,
                k_transdir2:        transConfig[2].dir
            }

            if(status == 1)                   { operetarOption["k_kw_enable"] = 1; }
            if(keyword[0].overlap == 1)       { operetarOption["k_overlap"] = 1; }
            if(keyword[0].rest_alert == 1)    { operetarOption["k_rest_alert"] = 1; }
            if(keyword[0].terion_dura == 1)   { operetarOption["k_criterion_enab"] = 1; }
            if(keyword[0].discontinuity == 1) { operetarOption["k_discontinuity"] = 1; }
            if(ts_del == 1)                   { operetarOption["k_auto_del"] = 1; }

            this.addKeywordEpgrecOperater.execute(operetarOption, () => {
                this.results = { status: "completed", keyword_id: this.option["keyword_id"], enable: this.option["status"] == 1? true : false };
                this.eventsNotify();
            },
            () => {
                this.results = { status: "error", keyword_id: this.option["keyword_id"] };
                this.eventsNotify();
            });
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }
}

export default KeywordEnableModel;

