"use strict";

import ApiModel from '../ApiModel';
import StreamManager from '../../../Stream/StreamManager';
import Sql from '../../../Sql/Sql';

class LiveWatchStreamInfoModel extends ApiModel {
    private getLiveProgramListSql: Sql;
    private getRecordedStreamInfoSql: Sql;
    private streamStatus: { [key: string]: any }[] | null = null;
    private minEndtime: number;

    constructor(
        _getLiveProgramListSql: Sql,
        _getRecordedStreamInfoSql: Sql
    ) {
        super();
        this.getLiveProgramListSql = _getLiveProgramListSql;
        this.getRecordedStreamInfoSql = _getRecordedStreamInfoSql;
    }

    public execute(): void {
        let streamId = this.option["streamId"];
        if(typeof streamId == "undefined") {
            this.streamStatus = StreamManager.getInstance().getStreamAllStatus();
        } else {
            this.streamStatus = [];
            let status = StreamManager.getInstance().getStreamStatus(Number(streamId));
            if(status != null) { this.streamStatus = [status] }
        }

        this.results = [];
        this.minEndtime = 6048000000;

        if(this.streamStatus.length == 0) {
            this.eventsNotify();
            return;
        }

        this.streamStatus.map((data: { [key: string]: any }) => {
            if(data["streamType"] == "live") { this.setLiveStreamInfo(data); }
            else if(data["streamType"] == "recorded") { this.setRecordedStreamInfo(data); }
            else if(data["streamType"] == "http-live" || data["streamType"] == "http-pc-live") { this.setHttpLiveStreamInfo(data); }
            else {
                this.results.push(data);
                this.checkDone();
            }
        });
    }

    private setLiveStreamInfo(data: { [key: string]: any }): void {
        let nowDate = new Date().getTime();

        this.getLiveProgramListSql.execute({sid: data["sid"], channel: data["channel"]}, (rows) => {
            data["name"] = rows["name"];
            data["title"] = rows["title"];
            data["starttime"] = rows["starttime"];
            data["endtime"] = rows["endtime"];
            data["description"] = rows["description"];

            this.results.push(data);

            let endtime = new Date(data["endtime"]).getTime() - nowDate;
            if(this.minEndtime > endtime) { this.minEndtime = endtime; }

            this.checkDone();
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }

    private setRecordedStreamInfo(data: any): void {
        this.getRecordedStreamInfoSql.execute({ type: data.type, id: data.id }, (rows) => {
            data["name"] = rows["name"];
            data["title"] = rows["title"];
            data["starttime"] = rows["starttime"];
            data["endtime"] = rows["endtime"];
            data["description"] = rows["description"];

            this.results.push(data);

            this.checkDone();
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }

    private setHttpLiveStreamInfo(data: any): void {
        let nowDate = new Date().getTime();

        this.getLiveProgramListSql.execute({sid: data["sid"], channel: data["channel"]}, (rows) => {
            data["name"] = rows["name"];
            data["title"] = rows["title"];
            data["starttime"] = rows["starttime"];
            data["endtime"] = rows["endtime"];
            data["description"] = rows["description"];

            this.results.push(data);

            let endtime = new Date(data["endtime"]).getTime() - nowDate;
            if(this.minEndtime > endtime) { this.minEndtime = endtime; }

            this.checkDone();
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }

    private checkDone(): void {
        if(this.streamStatus != null && this.results.length == this.streamStatus.length) {
            //ソート
            this.results.sort((a: { [key: string]: any }, b: { [key: string]: any }) => {
                if( a["streamNumber"] < b["streamNumber"] ) { return -1; }
                if( a["streamNumber"] > b["streamNumber"] ) { return 1; }
                return 0;
            });

            if(typeof this.option["streamId"] == "undefined") {
                this.results.push({ updateTime: this.minEndtime + this.getRandtime() });
            } else {
                this.results = this.results[0];
                this.results["updateTime"] = this.minEndtime + this.getRandtime();
            }
            this.eventsNotify();
        }
    }
}

export default LiveWatchStreamInfoModel;

