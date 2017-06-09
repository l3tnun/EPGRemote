"use strict";

import ModelFactory from './ModelFactory';
import ResponseSpecifiedFileModel from './ResponseSpecifiedFileModel';
import BroadcastModel from './Api/Broadcast/BroadcastModel';
import LiveConfigModel from './Api/Live/LiveConfigModel';
import LiveEnableConfigModel from './Api/Live/LiveEnableConfigModel';
import LiveHttpConfigModel from './Api/Live/LiveHttpConfigModel';
import LiveProgramModel from './Api/Live/LiveProgramModel';
import LiveWatchChangeStreamModel from './Api/Live/LiveWatchChangeStreamModel';
import LiveWatchStartStreamModel from './Api/Live/LiveWatchStartStreamModel';
import LiveWatchStopStreamModel from './Api/Live/LiveWatchStopStreamModel';
import LiveWatchStreamInfoModel from './Api/Live/LiveWatchStreamInfoModel';
import LiveHttpWatchModel from './Api/Live/LiveHttpWatchModel';
import RecordedWatchStartStreamModel from './Api/Live/RecordedWatchStartStreamModel';
import ProgramAutorecModel from './Api/Program/ProgramAutorecModel';
import ProgramCancelRecModel from './Api/Program/ProgramCancelRecModel';
import ProgramConfigModel from './Api/Program/ProgramConfigModel';
import ProgramCustomRecModel from './Api/Program/ProgramCustomRecModel';
import ProgramModel from './Api/Program/ProgramModel';
import ProgramSimpleRecModel from './Api/Program/ProgramSimpleRecModel';
import RecordedCategoryListModel from './Api/Recorded/RecordedCategoryListModel';
import RecordedChannelListModel from './Api/Recorded/RecordedChannelListModel';
import RecordedDeleteVideoModel from './Api/Recorded/RecordedDeleteVideoModel';
import RecordedKeywordListModel from './Api/Recorded/RecordedKeywordListModel';
import RecordedListModel from './Api/Recorded/RecordedListModel';
import RecordedVideoPathModel from './Api/Recorded/RecordedVideoPathModel';
import ReservationCancelRecModel from './Api/Reservation/ReservationCancelRecModel';
import ReservationModel from './Api/Reservation/ReservationModel';
import KeywordAddModel from './Api/Keyword/KeywordAddModel';
import KeywordDeleteModel from './Api/Keyword/KeywordDeleteModel';
import KeywordEnableModel from './Api/Keyword/KeywordEnableModel';
import KeywordModel from './Api/Keyword/KeywordModel';
import SearchConfigModel from './Api/Search/SearchConfigModel';
import SearchModel from './Api/Search/SearchModel';
import LogModel from './Api/Log/LogModel';
import EPGSingleUpdateModel from './Api/Epg/EPGSingleUpdateModel';
import DiskModel from './Api/Disk/DiskModel';
import KodiRecordedModel from './Api/Kodi/KodiRecordedModel';

import LiveStream from '../Stream/LiveStream/LiveStream';
import HttpStream from '../Stream/HttpStream/HttpStream';
import RecordedStream from '../Stream/RecordedStream/RecordedStream';

import GetLiveProgramListSql from '../Sql/GetLiveProgramListSql';
import GetRecordedStreamInfoSql from '../Sql/GetRecordedStreamInfoSql';
import GetProgramListSql from '../Sql/GetProgramListSql';
import GetRecordedCategoryListSql from '../Sql/GetRecordedCategoryListSql';
import GetRecordedChannelListSql from '../Sql/GetRecordedChannelListSql';
import GetRecordedKeywordListSql from '../Sql/GetRecordedKeywordListSql';
import GetRecordedListSql from '../Sql/GetRecordedListSql';
import GetRecordedVideoPathSql from '../Sql/GetRecordedVideoPathSql';
import GetReservationListSql from '../Sql/GetReservationListSql';
import GetKeywordByIdSql from '../Sql/GetKeywordByIdSql';
import GetKeywordListSql from '../Sql/GetKeywordListSql';
import GetSearchConfigSql from '../Sql/GetSearchConfigSql';
import GetSearchResultConfigSql from '../Sql/GetSearchResultConfigSql';
import GetLogListSql from '../Sql/GetLogListSql';
import GetKodiRecordedListSql from '../Sql/GetKodiRecordedListSql';

import AutorecEpgrecOperater from '../EpgrecOperater/AutorecEpgrecOperater';
import CancelRecEpgrecOperater from '../EpgrecOperater/CancelRecEpgrecOperater'
import CustomRecEpgrecOperater from '../EpgrecOperater/CustomRecEpgrecOperater';
import SimpleRecEpgrecOperater from '../EpgrecOperater/SimpleRecEpgrecOperater';
import DeleteVideoEpgrecOperater from '../EpgrecOperater/DeleteVideoEpgrecOperater';
import CancelReservationEpgrecOperater from '../EpgrecOperater/CancelReservationEpgrecOperater';
import AddKeywordEpgrecOperater from '../EpgrecOperater/AddKeywordEpgrecOperater';
import DeleteKeywordEpgrecOperater from '../EpgrecOperater/DeleteKeywordEpgrecOperater';
import SearchEpgrecOperater from '../EpgrecOperater/SearchEpgrecOperater'
import EPGSingleUpdateEpgrecOperater from '../EpgrecOperater/EPGSingleUpdateEpgrecOperater'

/**
* ModelFactory に実際に Model を追加する
*/
namespace ModelFactoryAdd {
    export const init = (): void => {
        let factory = ModelFactory.getInstance();

        factory.add("ResponseSpecifiedFileModel", () => { return new ResponseSpecifiedFileModel(); });

        //Broadcast
        factory.add("BroadcastModel", () => { return new BroadcastModel(); });

        //Live
        factory.add("LiveConfigModel", () => { return new LiveConfigModel(); });
        factory.add("LiveEnableConfigModel", () => { return new LiveEnableConfigModel(); });
        factory.add("LiveHttpConfigModel", () => { return new LiveHttpConfigModel(); });
        factory.add("LiveProgramModel", () => {
            return new LiveProgramModel(new GetLiveProgramListSql());
        });
        factory.add("LiveWatchChangeStreamModel", () => { return new LiveWatchChangeStreamModel(
            (channel: string, sid: string, tunerId: number, videoId: number) => {
                return new LiveStream(channel, sid, tunerId, videoId);
            }
        ); });
        factory.add("LiveWatchStartStreamModel", () => { return new LiveWatchStartStreamModel(
            (channel: string, sid: string, tunerId: number, videoId: number) => {
                return new LiveStream(channel, sid, tunerId, videoId);
            }
        ); });
        factory.add("LiveHttpWatchModel", () => { return new LiveHttpWatchModel(
            (channel: string, sid: string, tunerId: number, videoId: number, pc: boolean) => {
                return new HttpStream(channel, sid, tunerId, videoId, pc);
            }
        ); });

        factory.add("LiveWatchStopStreamModel", () => { return new LiveWatchStopStreamModel(); });
        factory.add("LiveWatchStreamInfoModel", () => {
            return new LiveWatchStreamInfoModel(
                new GetLiveProgramListSql(),
                new GetRecordedStreamInfoSql()
            );
        });
        factory.add("RecordedWatchStartStreamModel", () => { return new RecordedWatchStartStreamModel(
            (id: number, type: string, videoId: number) => {
                return new RecordedStream(id, type, videoId);
            }
        ); });

        //Program
        factory.add("ProgramAutorecModel", () => {
            return new ProgramAutorecModel(new AutorecEpgrecOperater());
        });
        factory.add("ProgramCancelRecModel", () => {
            return new ProgramCancelRecModel(new CancelRecEpgrecOperater());
        });
        factory.add("ProgramConfigModel", () => { return new ProgramConfigModel(); });
        factory.add("ProgramCustomRecModel", () => {
            return new ProgramCustomRecModel(new CustomRecEpgrecOperater());
        });
        factory.add("ProgramModel", () => {
            return new ProgramModel(new GetProgramListSql());
        });
        factory.add("ProgramSimpleRecModel", () => {
            return new ProgramSimpleRecModel(new SimpleRecEpgrecOperater());
        });

        //Recorded
        factory.add("RecordedCategoryListModel", () => {
            return new RecordedCategoryListModel(new GetRecordedCategoryListSql());
        });
        factory.add("RecordedChannelListModel", () => {
            return new RecordedChannelListModel(new GetRecordedChannelListSql());
        });
        factory.add("RecordedDeleteVideoModel", () => {
            return new RecordedDeleteVideoModel(new DeleteVideoEpgrecOperater());
        });
        factory.add("RecordedKeywordListModel", () => {
            return new RecordedKeywordListModel(new GetRecordedKeywordListSql());
        });
        factory.add("RecordedListModel", () => {
            return new RecordedListModel(new GetRecordedListSql());
        });
        factory.add("RecordedVideoPathModel", () => {
            return new RecordedVideoPathModel(new GetRecordedVideoPathSql());
        });

        //Reservation
        factory.add("ReservationCancelRecModel", () => {
            return new ReservationCancelRecModel(new CancelReservationEpgrecOperater());
        });
        factory.add("ReservationModel", () => {
            return new ReservationModel(new GetReservationListSql());
        });

        //Keyword
        factory.add("KeywordAddModel", () => {
            return new KeywordAddModel(new AddKeywordEpgrecOperater());
        });
        factory.add("KeywordDeleteModel", () => {
            return new KeywordDeleteModel(new DeleteKeywordEpgrecOperater());
        });
        factory.add("KeywordEnableModel", () => {
            return new KeywordEnableModel(
                new GetKeywordByIdSql(),
                new AddKeywordEpgrecOperater()
            );
        });
        factory.add("KeywordModel", () => {
            return new KeywordModel(new GetKeywordListSql());
        });

        //Search
        factory.add("SearchConfigModel", () => {
            return new SearchConfigModel(new GetSearchConfigSql());
        });
        factory.add("SearchModel", () => {
            return new SearchModel(
                new GetSearchResultConfigSql(),
                new SearchEpgrecOperater()
            );
        });

        //Log
        factory.add("LogModel", () => {
            return new LogModel(new GetLogListSql());
        });

        //EPG
        factory.add("EPGSingleUpdateModel", () => {
            return new EPGSingleUpdateModel(new EPGSingleUpdateEpgrecOperater());
        });

        //Disk
        factory.add("DiskModel", () => { return new DiskModel(); });

        //Kodi
        factory.add("KodiRecordedModel", () => {
            return new KodiRecordedModel(new GetKodiRecordedListSql());
        });
    }
}

export default ModelFactoryAdd;

