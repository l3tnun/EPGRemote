"use strict";

import ModelFactory from './ModelFactory';
import { DialogModel } from '../Model/Dialog/DialogModel';
import { SnackbarModel } from '../Model/Snackbar/SnackbarModel';
import { LiveWatchVideoModel } from '../Model/LiveWatchVideo/LiveWatchVideoModel';
import { LiveProgramApiModel } from '../Model/Api/Live/LiveProgramApiModel';
import { BroadCastApiModel } from '../Model/Api/BroadCastApiModel';
import { LiveWatchStopStreamApiModel } from '../Model/Api/Live/Watch/LiveWatchStopStreamApiModel';
import { LiveOtherStreamInfoApiModel } from '../Model/Api/Live/LiveOtherStreamInfoApiModel';
import { LiveWatchStreamInfoApiModel } from '../Model/Api/Live/Watch/LiveWatchStreamInfoApiModel';
import { LiveConfigApiModel } from '../Model/Api/Live/LiveConfigApiModel';
import { LiveStartWatchApiModel } from '../Model/Api/Live/Watch/LiveStartWatchApiModel';
import { LiveRecordedStartWatchApiModel } from '../Model/Api/Live/Watch/LiveRecordedStartWatchApiModel';
import { LiveConfigEnableApiModel } from '../Model/Api/Live/LiveConfigEnableApiModel';
import { LiveHttpConfigApiModel } from '../Model/Api/Live/LiveHttpConfigApiModel';
import { KeywordApiModel } from '../Model/Api/Keyword/KeywordApiModel';
import { LogPageApiModel } from '../Model/Api/LogPage/LogPageApiModel';
import { RecordedApiModel } from '../Model/Api/Recorded/RecordedApiModel';
import { RecordedVideoLinkApiModel } from '../Model/Api/Recorded/RecordedVideoLinkApiModel';
import { RecordedSearchConfigApiModel } from '../Model/Api/Recorded/RecordedSearchConfigApiModel';
import { ReservationApiModel } from '../Model/Api/Reservation/ReservationApiModel';
import { RecordedVideoConfigApiModel } from '../Model/Api/Recorded/RecordedVideoConfigApiModel';
import { ProgramApiModel } from '../Model/Api/Program/ProgramApiModel';
import { ProgramConfigApiModel } from '../Model/Api/Program/ProgramConfigApiModel';
import { SearchConfigApiModel } from '../Model/Api/Search/SearchConfigApiModel';
import { SearchKeywordConfigApiModel } from '../Model/Api/Search/SearchKeywordConfigApiModel';
import { SearchResultApiModel } from '../Model/Api/Search/SearchResultApiModel';
import { EnableKeywordEpgrecModuleModel } from '../Model/Api/EpgrecModule/EnableKeywordEpgrecModuleModel';
import { DeleteKeywordEpgrecModuleModel } from '../Model/Api/EpgrecModule/DeleteKeywordEpgrecModuleModel';
import { DeleteVideoEpgrecModuleModel } from '../Model/Api/EpgrecModule/DeleteVideoEpgrecModuleModel';
import { CancelReservationEpgrecModuleModel } from '../Model/Api/EpgrecModule/CancelReservationEpgrecModuleModel';
import { CancelRecEpgrecModuleModel } from '../Model/Api/EpgrecModule/CancelRecEpgrecModuleModel';
import { AutoRecEpgrecModuleModel } from '../Model/Api/EpgrecModule/AutoRecEpgrecModuleModel';
import { SimpleRecEpgrecModuleModel } from '../Model/Api/EpgrecModule/SimpleRecEpgrecModuleModel'
import { CustomRecEpgrecModuleModel } from '../Model/Api/EpgrecModule/CustomRecEpgrecModuleModel'
import { EPGSingleUpdateEpgrecModuleModel } from '../Model/Api/EpgrecModule/EPGSingleUpdateEpgrecModuleModel';
import { AddKeywordEpgrecModuleModel } from '../Model/Api/EpgrecModule/AddKeywordEpgrecModuleModel';
import { StorageModel } from '../Model/Storage/StorageModel';
import { HlsModel } from '../Model/Hls/HlsModel';
import { DiskApiModel } from '../Model/Api/Disk/DiskApiModel';

/**
* ModelFactory に Model を登録する
*/

namespace ModelFactoryAdd {
    export const init = (): void => {
        let factory = ModelFactory.getInstance();

        //model の準備
        let dialogModel = new DialogModel();
        let snackbarModel = new SnackbarModel();
        let liveWatchVideoModel = new LiveWatchVideoModel();
        let liveProgramApiModel = new LiveProgramApiModel();
        let broadCastApiModel = new BroadCastApiModel();
        let liveWatchStopStreamApiModel = new LiveWatchStopStreamApiModel();
        let liveOtherStreamInfoApiModel = new LiveOtherStreamInfoApiModel();
        let liveWatchStreamInfoApiModel = new LiveWatchStreamInfoApiModel();
        let liveConfigApiModel = new LiveConfigApiModel();
        let liveStartWatchApiModel = new LiveStartWatchApiModel();
        let liveRecordedStartWatchApiModel = new LiveRecordedStartWatchApiModel();
        let liveConfigEnableApiModel = new LiveConfigEnableApiModel();
        let liveHttpConfigApiModel = new LiveHttpConfigApiModel();
        let keywordApiModel = new KeywordApiModel();
        let logPageApiModel = new LogPageApiModel();
        let recordedApiModel = new RecordedApiModel();
        let recordedVideoLinkApiModel = new RecordedVideoLinkApiModel();
        let recordedVideoConfigApiModel = new RecordedVideoConfigApiModel();
        let recordedSearchConfigApiModel = new RecordedSearchConfigApiModel();
        let reservationApiModel = new ReservationApiModel();
        let programApiModel = new ProgramApiModel();
        let searchConfigApiModel = new SearchConfigApiModel();
        let searchKeywordConfigApiModel = new SearchKeywordConfigApiModel();
        let searchResultApiModel = new SearchResultApiModel();
        let programConfigApiModel = new ProgramConfigApiModel();
        let enableKeywordEpgrecModuleModel = new EnableKeywordEpgrecModuleModel(keywordApiModel);
        let deleteKeywordEpgrecModuleModel = new DeleteKeywordEpgrecModuleModel(keywordApiModel);
        let deleteVideoEpgrecModuleModel = new DeleteVideoEpgrecModuleModel(recordedApiModel);
        let cancelReservationEpgrecModuleModel = new CancelReservationEpgrecModuleModel(reservationApiModel);
        let cancelRecEpgrecModuleModel = new CancelRecEpgrecModuleModel(programApiModel, searchResultApiModel);
        let autoRecEpgrecModuleModel = new AutoRecEpgrecModuleModel(programApiModel, searchResultApiModel);
        let simpleRecEpgrecModuleModel = new SimpleRecEpgrecModuleModel(programApiModel, searchResultApiModel);
        let customRecEpgrecModuleModel = new CustomRecEpgrecModuleModel(programApiModel, searchResultApiModel);
        let epgSingleUpdateEpgrecModuleModel = new EPGSingleUpdateEpgrecModuleModel(programApiModel);
        let addKeywordEpgrecModuleModel = new AddKeywordEpgrecModuleModel();
        let storageModel = new StorageModel();
        let hlsModel = new HlsModel();
        let diskApiModel = new DiskApiModel();

        //追加
        factory.add("DialogModel", dialogModel);
        factory.add("SnackbarModel", snackbarModel);
        factory.add("LiveWatchVideoModel", liveWatchVideoModel);
        factory.add("LiveProgramApiModel", liveProgramApiModel);
        factory.add("BroadCastApiModel", broadCastApiModel);
        factory.add("LiveWatchStopStreamApiModel", liveWatchStopStreamApiModel);
        factory.add("LiveOtherStreamInfoApiModel", liveOtherStreamInfoApiModel);
        factory.add("LiveWatchStreamInfoApiModel", liveWatchStreamInfoApiModel);
        factory.add("LiveConfigApiModel", liveConfigApiModel);
        factory.add("LiveStartWatchApiModel", liveStartWatchApiModel);
        factory.add("LiveRecordedStartWatchApiModel", liveRecordedStartWatchApiModel);
        factory.add("LiveConfigEnableApiModel", liveConfigEnableApiModel);
        factory.add("LiveHttpConfigApiModel", liveHttpConfigApiModel);
        factory.add("KeywordApiModel", keywordApiModel);
        factory.add("LogPageApiModel", logPageApiModel);
        factory.add("RecordedApiModel", recordedApiModel);
        factory.add("RecordedVideoLinkApiModel", recordedVideoLinkApiModel);
        factory.add("RecordedVideoConfigApiModel", recordedVideoConfigApiModel);
        factory.add("RecordedSearchConfigApiModel", recordedSearchConfigApiModel);
        factory.add("ReservationApiModel", reservationApiModel);
        factory.add("ProgramApiModel", programApiModel);
        factory.add("ProgramConfigApiModel", programConfigApiModel);
        factory.add("SearchConfigApiModel", searchConfigApiModel);
        factory.add("SearchKeywordConfigApiModel", searchKeywordConfigApiModel);
        factory.add("SearchResultApiModel", searchResultApiModel);
        factory.add("EnableKeywordEpgrecModuleModel", enableKeywordEpgrecModuleModel);
        factory.add("DeleteKeywordEpgrecModuleModel", deleteKeywordEpgrecModuleModel);
        factory.add("DeleteVideoEpgrecModuleModel", deleteVideoEpgrecModuleModel);
        factory.add("CancelReservationEpgrecModuleModel", cancelReservationEpgrecModuleModel);
        factory.add("CancelRecEpgrecModuleModel", cancelRecEpgrecModuleModel);
        factory.add("AutoRecEpgrecModuleModel", autoRecEpgrecModuleModel);
        factory.add("SimpleRecEpgrecModuleModel", simpleRecEpgrecModuleModel);
        factory.add("CustomRecEpgrecModuleModel", customRecEpgrecModuleModel);
        factory.add("EPGSingleUpdateEpgrecModuleModel", epgSingleUpdateEpgrecModuleModel);
        factory.add("AddKeywordEpgrecModuleModel", addKeywordEpgrecModuleModel);
        factory.add("StorageModel", storageModel);
        factory.add("HlsModel", hlsModel);
        factory.add("DiskApiModel", diskApiModel);
    }
}

export default ModelFactoryAdd;

