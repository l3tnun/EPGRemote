"use strict";

import * as m from 'mithril';
import EpgrecModuleModel from './EpgrecModuleModel';

interface AddKeywordEpgrecModuleQuery {
    keyword_id?:        number;
    keyword:            string;
    use_regexp:         boolean;
    collate_ci:         boolean;
    ena_title:          boolean;
    ena_desc:           boolean;
    typeGR:             boolean;
    typeBS:             boolean;
    typeCS:             boolean;
    typeEX:             boolean;
    channel_id:         number;
    category_id:        number;
    sub_genre:          number;
    first_genre:        boolean;
    prgtime:            number;
    period:             number;
    week0:              boolean;
    week1:              boolean;
    week2:              boolean;
    week3:              boolean;
    week4:              boolean;
    week5:              boolean;
    week6:              boolean;
    kw_enable:          boolean;
    overlap:            boolean;
    rest_alert:         boolean;
    criterion_dura:     boolean;
    discontinuity:      boolean;
    sft_start:          number;
    sft_end:            number;
    split_time:         number;
    priority:           number;
    autorec_mode:       number;
    directory:          string;
    filename_format:    string;
    trans_mode0:        number;
    transdir0:          string;
    trans_mode1:        number;
    transdir1:          string;
    trans_mode2:        number;
    transdir2:          string;
    ts_del:             boolean;
}

interface AddKeywordEpgrecModuleModelInterface extends EpgrecModuleModel {
    execute(query: AddKeywordEpgrecModuleQuery): void;
    viewUpdate(value: { [key: string]: any; }): void;
}

/**
* epgrec のキーワード追加を行う
*/
class AddKeywordEpgrecModuleModel extends EpgrecModuleModel implements AddKeywordEpgrecModuleModelInterface {
    /**
    * キーワード追加
    */
    public execute(query: AddKeywordEpgrecModuleQuery): void {
        let option = {
            keyword:            query.keyword,
            use_regexp:         query.use_regexp ? 1 : 0,
            collate_ci:         query.collate_ci ? 1 : 0,
            ena_title:          query.ena_title ? 1 : 0,
            ena_desc:           query.ena_desc ? 1 : 0,
            typeGR:             query.typeGR ? 1 : 0,
            typeBS:             query.typeBS ? 1 : 0,
            typeCS:             query.typeCS ? 1 : 0,
            typeEX:             query.typeEX ? 1 : 0,
            channel_id:         query.channel_id,
            category_id:        query.category_id,
            sub_genre:          query.sub_genre,
            first_genre:        query.first_genre ? 1 : 0,
            prgtime:            query.prgtime,
            period:             query.period,
            week0:              query.week0 ? 1 : 0,
            week1:              query.week1 ? 1 : 0,
            week2:              query.week2 ? 1 : 0,
            week3:              query.week3 ? 1 : 0,
            week4:              query.week4 ? 1 : 0,
            week5:              query.week5 ? 1 : 0,
            week6:              query.week6 ? 1 : 0,
            kw_enable:          query.kw_enable ? 1 : 0,
            overlap:            query.overlap ? 1 : 0,
            rest_alert:         query.rest_alert ? 1 : 0,
            criterion_dura:     query.criterion_dura ? 1 : 0,
            discontinuity:      query.discontinuity ? 1 : 0,
            sft_start:          query.sft_start,
            sft_end:            query.sft_end,
            split_time:         query.split_time,
            priority:           query.priority,
            autorec_mode:       query.autorec_mode,
            directory:          query.directory,
            filename_format:    query.filename_format,
            trans_mode0:        query.trans_mode0,
            transdir0:          query.transdir0,
            trans_mode1:        query.trans_mode1,
            transdir1:          query.transdir1,
            trans_mode2:        query.trans_mode2,
            transdir2:          query.transdir2,
            ts_del:             query.ts_del ? 1 : 0
        };

        if(typeof m.route.param("keyword_id") != "undefined") {
            option["keyword_id"] = Number(m.route.param("keyword_id"));
        }


        this.getRequest({
            method: "POST",
            url: `/api/keyword`,
            data: m.buildQueryString(option)
        },
        (value: {}) => { this.viewUpdate(value); },
        "AddKeywordEpgrecModuleModel error.");
    }

    public viewUpdate(value: { [key: string]: any; }): void {
        super.viewUpdate(value);
        let snackbarStr = typeof m.route.param("keyword_id") == "undefined" ? "キーワードの追加" : "自動キーワードの更新";

        snackbarStr += value["status"] == "error" ? "失敗" : "成功";

        this.snackbar.open(snackbarStr);

        setTimeout(() => {
            m.route.set("/keyword");
        }, 1000);
    }
}

export { AddKeywordEpgrecModuleQuery, AddKeywordEpgrecModuleModel, AddKeywordEpgrecModuleModelInterface };

