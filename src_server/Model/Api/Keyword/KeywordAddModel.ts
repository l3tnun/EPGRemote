"use strict";

import ApiModel from '../ApiModel';
import EpgrecOperater from '../../../EpgrecOperater/EpgrecOperater'

class KeywordAddModel extends ApiModel {
    private addKeywordEpgrecOperater: EpgrecOperater;

    constructor(_addKeywordEpgrecOperater: EpgrecOperater) {
        super();
        this.addKeywordEpgrecOperater = _addKeywordEpgrecOperater;
    }

    public execute(): void {
        if(typeof this.option["keyword"] == "undefined"
            || typeof this.option["use_regexp"] == "undefined"
            || typeof this.option["collate_ci"] == "undefined"
            || typeof this.option["ena_title"] == "undefined"
            || typeof this.option["ena_desc"] == "undefined"
            || typeof this.option["typeGR"] == "undefined"
            || typeof this.option["typeBS"] == "undefined"
            || typeof this.option["typeCS"] == "undefined"
            || typeof this.option["typeEX"] == "undefined"
            || typeof this.option["channel_id"] == "undefined"
            || typeof this.option["category_id"] == "undefined"
            || typeof this.option["sub_genre"] == "undefined"
            || typeof this.option["first_genre"] == "undefined"
            || typeof this.option["prgtime"] == "undefined"
            || typeof this.option["period"] == "undefined"
            || typeof this.option["week0"] == "undefined"
            || typeof this.option["week1"] == "undefined"
            || typeof this.option["week2"] == "undefined"
            || typeof this.option["week3"] == "undefined"
            || typeof this.option["week4"] == "undefined"
            || typeof this.option["week5"] == "undefined"
            || typeof this.option["week6"] == "undefined"
            || typeof this.option["kw_enable"] == "undefined"
            || typeof this.option["overlap"] == "undefined"
            || typeof this.option["rest_alert"] == "undefined"
            || typeof this.option["criterion_dura"] == "undefined"
            || typeof this.option["discontinuity"] == "undefined"
            || typeof this.option["sft_start"] == "undefined"
            || typeof this.option["sft_end"] == "undefined"
            || typeof this.option["split_time"] == "undefined"
            || typeof this.option["priority"] == "undefined"
            || typeof this.option["autorec_mode"] == "undefined"
            || typeof this.option["directory"] == "undefined"
            || typeof this.option["filename_format"] == "undefined"
            || typeof this.option["trans_mode0"] == "undefined"
            || typeof this.option["transdir0"] == "undefined"
            || typeof this.option["trans_mode1"] == "undefined"
            || typeof this.option["transdir1"] == "undefined"
            || typeof this.option["trans_mode2"] == "undefined"
            || typeof this.option["transdir2"] == "undefined"
            || typeof this.option["ts_del"] == "undefined"
        ) {
            this.errors = 415;
            this.eventsNotify();
            return;
        }

        let operetarOption = {}
        try {
            operetarOption = {
                add_keyword:        1,
                keyword_id:         0,
                k_use_regexp:       this.option["use_regexp"],
                k_collate_ci:       this.option["collate_ci"],
                k_ena_title:        this.option["ena_title"],
                k_ena_desc:         this.option["ena_desc"],
                k_search:           this.option["keyword"],
                k_typeGR:           this.option["typeGR"],
                k_typeBS:           this.option["typeBS"],
                k_typeCS:           this.option["typeCS"],
                k_typeEX:           this.option["typeEX"],
                k_category:         this.option["category_id"],
                k_station:          this.option["channel_id"],
                k_weekofday:        this.getWeekofday(),
                k_prgtime:          this.option["prgtime"],
                k_period:           this.option["period"],
                k_sub_genre:        this.option["sub_genre"],
                k_first_genre:      this.option["first_genre"],
                k_criterion_dura:   this.option["criterion_dura"],
                k_sft_start:        this.option["sft_start"],
                k_sft_end:          this.option["sft_end"],
                autorec_mode:       this.option["autorec_mode"],
                k_priority:         this.option["priority"],
                k_split_time:       this.option["split_time"],
                k_directory:        this.option["directory"],
                k_filename:         this.option["filename_format"],
                k_trans_mode0:      this.option["trans_mode0"],
                k_transdir0:        this.option["transdir0"],
                k_trans_mode1:      this.option["trans_mode1"],
                k_transdir1:        this.option["transdir1"],
                k_trans_mode2:      this.option["trans_mode2"],
                k_transdir2:        this.option["transdir2"],
            }

            if(typeof this.option["keyword_id"] != "undefined") { operetarOption["keyword_id"] = this.option["keyword_id"]; }
            if(this.option["kw_enable"] == 1)           { operetarOption["k_kw_enable"] = 1; }
            if(this.option["overlap"] == 1)             { operetarOption["k_overlap"] = 1; }
            if(this.option["rest_alert"] == 1)          { operetarOption["k_rest_alert"] = 1; }
            if(this.option["criterion_dura"] == 1)      { operetarOption["k_criterion_enab"] = 1; }
            if(this.option["discontinuity"] == 1)       { operetarOption["k_discontinuity"] = 1; }
            if(this.option["ts_del"] == 1)              { operetarOption["k_auto_del"] = 1; }
        } catch(e) {
            this.errors = 415;
            this.eventsNotify();
            return;
        }

        this.addKeywordEpgrecOperater.execute(operetarOption, () => {
            this.results = { status: "completed" };
            this.eventsNotify();
        },
        () => {
            this.results = { status: "error" };
            this.eventsNotify();
        });
    }

    private getWeekofday(): number {
        let weekofday = 0;
        if(this.option["week0"] == 1) { weekofday += 0x1; }
        if(this.option["week1"] == 1) { weekofday += 0x2; }
        if(this.option["week2"] == 1) { weekofday += 0x4; }
        if(this.option["week3"] == 1) { weekofday += 0x8; }
        if(this.option["week4"] == 1) { weekofday += 0x10; }
        if(this.option["week5"] == 1) { weekofday += 0x20; }
        if(this.option["week6"] == 1) { weekofday += 0x40; }

        return weekofday;
    }
}

export default KeywordAddModel;

