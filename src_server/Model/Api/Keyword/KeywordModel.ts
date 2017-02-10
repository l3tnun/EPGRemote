"use strict";

import ApiModel from '../ApiModel';
import Sql from '../../../Sql/Sql';
import SubGenreModule from '../../SubGenreModule';

class KeywordModel extends ApiModel {
    private getKeywordListSql: Sql;

    constructor(_getKeywordListSql: Sql) {
        super();
        this.getKeywordListSql = _getKeywordListSql;
    }

    public execute(): void {
        if(this.checkNull(this.option["limit"])) { this.option["limit"] = 24; }
        if(this.checkNull(this.option["page"])) { this.option["page"] = 1; }

        let configJson = this.config.getConfig();
        this.getKeywordListSql.execute(this.option, (rows) => {
            this.results = {}

            //channel name
            let channelName = {}
            rows[0].forEach((result: { [key: string]: any }) => {
                channelName[result["id"]] = result["name"];
            });
            channelName[0] = "すべて";

            //categoryName
            let categoryName = {}
            rows[1].forEach((result: { [key: string]: any }) => {
                categoryName[result["id"]] = result["name_jp"];
            });
            categoryName[0] = "すべて";

            let recordedCount = {}
            rows[2].forEach((result: { [key: string]: any }) => {
                recordedCount[result["autorec"]] = result["count(id)"];
            });

            let recMode = configJson.epgrecConfig.recMode;

            //予約一覧
            let keywords: { [key: string]: any }[] = []
            rows[3].forEach((result: { [key: string]: any }) => {
                let keyword = {}
                keyword["id"] = result["id"];
                keyword["keyword"] = result["keyword"];
                keyword["use_regexp"] = result["use_regexp"] == 1;             //正規表現
                keyword["collate_ci"] = result["collate_ci"] == 1;             //全角半角同一視
                keyword["ena_title"] = result["ena_title"] == 1;               //タイトル
                keyword["ena_desc"] = result["ena_desc"] == 1;                 //概要
                keyword["overlap"] = result["overlap"] == 1;                   //多重予約
                keyword["rest_alert"] = result["rest_alert"] == 1;             //無該当警告
                keyword["criterion_dura"] = result["criterion_dura"] == 1;     //時間量変動警告
                keyword["discontinuity"] = result["discontinuity"] == 1;       //隣接禁止
                keyword["split_time"] = result["split_time"];                  //分割
                keyword["kw_enable"] = result["kw_enable"] == 1;               //キーワード有効
                keyword["channel_name"] = channelName[result["channel_id"]];
                keyword["channel_id"] = result["channel_id"];
                keyword["category_name"] = categoryName[result["category_id"]];
                keyword["category_id"] = result["category_id"];
                keyword["subGenre"] = `${SubGenreModule.getSubGenre(result["category_id"], result["sub_genre"])}`;
                keyword["subGenre_id"] = result["sub_genre"];
                keyword["typeGR"] = result["typeGR"] == 1;
                keyword["typeBS"] = result["typeBS"] == 1;
                keyword["typeCS"] = result["typeCS"] == 1;
                keyword["typeEX"] = result["typeEX"] == 1;
                keyword["weekofdays"] = this.getWeeks(result["weekofdays"]); //曜日
                keyword["startTime"] = Number(result["prgtime"]); //開始時間
                keyword["periodTime"] = result["period"]; //終了時間
                keyword["priority"] = result["priority"] //優先度
                keyword["sft_start"] = result["sft_start"];
                keyword["sft_end"] = result["sft_end"];
                //録画モード
                if(typeof recMode[result["autorec_mode"]] == "undefined") {
                    keyword["autorec_mode_name"] = null;
                } else {
                    keyword["autorec_mode_name"] = recMode[result["autorec_mode"]].name;
                }
                keyword["autorec_mode"] = result["autorec_mode"]; //録画モード
                keyword["firstGenre"] = result["first_genre"] == 1; //ジャンル全保持
                keyword["directory"] = result["directory"];
                keyword["filenameFormat"] = result["filename_format"]; //ファイル名フォーマット
                let recordedNum = recordedCount[result["id"]];
                if(typeof recordedNum == "undefined") {
                    keyword["recordedNum"] = 0;
                } else {
                    keyword["recordedNum"] = recordedNum;
                }
                keywords.push(keyword);
            });

            if(this.checkNull(this.option["keyword_id"])) {
                this.results = {
                    keywords: keywords,
                    limit: Number(this.option["limit"]),
                    totalNum: rows[4][0]["count(*)"]
                }
            } else {
                if(keywords.length == 1) {
                    let trans = rows[5];
                    let transConfig: { mode: any; dir: any; }[] = [];
                    let ts_del = 0;

                    for(let i = 0; i < 3; i++) {
                        if(typeof trans[i] == "undefined") {
                            transConfig.push({ mode: 0, dir: "" });
                        } else {
                            ts_del = trans[i]["ts_del"];
                            transConfig.push({
                                mode: trans[i].mode,
                                dir: trans[i].dir.toString('UTF-8')
                            });
                        }
                    }

                    keywords[0]["transConfig"] = transConfig;
                    keywords[0]["ts_del"] = ts_del;
                    this.results = {
                        keyword: keywords[0]
                    }
                } else {
                    this.errors = 500;
                }

                this.eventsNotify();
            }

            this.eventsNotify();
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }

    private getWeeks(weeks: number): { [key: number]: boolean } {
        let hash: { [key: number]: boolean } = {};
        hash[0] = ((weeks | 0x1) == weeks);
        hash[1] = ((weeks | 0x2) == weeks);
        hash[2] = ((weeks | 0x4) == weeks);
        hash[3] = ((weeks | 0x8) == weeks);
        hash[4] = ((weeks | 0x10) == weeks);
        hash[5] = ((weeks | 0x20) == weeks);
        hash[6] = ((weeks | 0x40) == weeks);

        return hash;
    }
}

export default KeywordModel;

