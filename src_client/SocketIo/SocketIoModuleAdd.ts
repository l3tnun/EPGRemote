"use strict";

import SocketIoManager from './SocketIoManager';
import LiveRefreshStream from './Modules/Live/LiveRefreshStreamSocketIoModule';
import LiveRefreshTuner from './Modules/Live/LiveRefreshTunerSocketIoModule';
import StopStreamSocketIoModule from './Modules/Live/StopStreamSocketIoModule';
import EnableStreamSocketIoModule from './Modules/Live/EnableStreamSocketIoModule';
import ReservationCancelRecSocketIoModule from './Modules/Reservation/ReservationCancelRecSocketIoModule';
import ReservationOtherEventSocketIoModule from './Modules/Reservation/ReservationOtherEventSocketIoModule';
import KeywordEnableSocketIoModule from './Modules/Keyword/KeywordEnableSocketIoModule';
import KeywordDeleteSocketIoModule from './Modules/Keyword/KeywordDeleteSocketIoModule';
import KeywordAddSocketIoModule from './Modules/Keyword/KeywordAddSocketIoModule';
import RecordedOtherEventSocketIoModule from './Modules/Recorded/RecordedOtherEventSocketIoModule';
import RecordedDeleteVideoSocketIoModule from './Modules/Recorded/RecordedDeleteVideoSocketIoModule';
import ProgramAutoRecSocketIoModule from './Modules/Program/ProgramAutoRecSocketIoModule';
import ProgramCancelRecSocketIoModule from './Modules/Program/ProgramCancelRecSocketIoModule';
import ProgramCustomRecSocketIoModule from './Modules/Program/ProgramCustomRecSocketIoModule';
import ProgramOtherEventSocketIoModule from './Modules/Program/ProgramOtherEventSocketIoModule';
import ProgramSimpleRecSocketIoModule from './Modules/Program/ProgramSimpleRecSocketIoModule';
import EPGSingleUpdateSocketIoModule from './Modules/EPG/EPGSingleUpdateSocketIoModule';
import SearchOtherEventSocketIoModule from './Modules/Search/SearchOtherEventSocketIoModule';
import ModelFactory from '../ModelFactory/ModelFactory';
import { LiveWatchVideoModelInterface } from '../Model/LiveWatchVideo/LiveWatchVideoModel';
import { LiveOtherStreamInfoApiModelInterface } from '../Model/Api/Live/LiveOtherStreamInfoApiModel';
import { LiveConfigApiModelInterface } from '../Model/Api/Live/LiveConfigApiModel';
import { CancelReservationEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/CancelReservationEpgrecModuleModel';
import { ReservationApiModelInterface } from '../Model/Api/Reservation/ReservationApiModel';
import { KeywordApiModelInterface } from '../Model/Api/Keyword/KeywordApiModel';
import { SearchResultApiModelInterface } from '../Model/Api/Search/SearchResultApiModel';
import { EnableKeywordEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/EnableKeywordEpgrecModuleModel';
import { DeleteKeywordEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/DeleteKeywordEpgrecModuleModel';
import { DeleteVideoEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/DeleteVideoEpgrecModuleModel';
import { RecordedApiModelInterface } from '../Model/Api/Recorded/RecordedApiModel';
import { ProgramApiModelInterface } from '../Model/Api/Program/ProgramApiModel';
import { AutoRecEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/AutoRecEpgrecModuleModel';
import { CancelRecEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/CancelRecEpgrecModuleModel';
import { CustomRecEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/CustomRecEpgrecModuleModel';
import { SimpleRecEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/SimpleRecEpgrecModuleModel';
import { EPGSingleUpdateEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/EPGSingleUpdateEpgrecModuleModel';

/**
* SocketIoManager に ./Module 下にある SocketIoModule を加える
* SocketIoModule で必要になる Model 等も生成して渡す
*/
namespace SocketIoModuleAdd {
    export const init = (): void => {
        let manager :SocketIoManager = SocketIoManager.getInstance();
        let modelFactory = ModelFactory.getInstance();

        //model の準備
        let liveWatchVideoModel = <LiveWatchVideoModelInterface>modelFactory.get("LiveWatchVideoModel");
        let liveOtherStreamInfoApiModel = <LiveOtherStreamInfoApiModelInterface>modelFactory.get("LiveOtherStreamInfoApiModel");
        let liveConfigApiModel = <LiveConfigApiModelInterface>modelFactory.get("LiveConfigApiModel");
        let recordedApiModel = <RecordedApiModelInterface>modelFactory.get("RecordedApiModel");
        let reservationApiModel = <ReservationApiModelInterface>modelFactory.get("ReservationApiModel");
        let keywordApiModel = <KeywordApiModelInterface>modelFactory.get("KeywordApiModel");
        let enableKeywordEpgrecModuleModel = <EnableKeywordEpgrecModuleModelInterface>modelFactory.get("EnableKeywordEpgrecModuleModel");
        let deleteKeywordEpgrecModuleModel = <DeleteKeywordEpgrecModuleModelInterface>modelFactory.get("DeleteKeywordEpgrecModuleModel");
        let deleteVideoEpgrecModuleModel = <DeleteVideoEpgrecModuleModelInterface>modelFactory.get("DeleteVideoEpgrecModuleModel");
        let cancelReservationEpgrecModuleModel = <CancelReservationEpgrecModuleModelInterface>modelFactory.get("CancelReservationEpgrecModuleModel");
        let programApiModel = <ProgramApiModelInterface>modelFactory.get("ProgramApiModel");
        let searchResultApiModel = <SearchResultApiModelInterface>modelFactory.get("SearchResultApiModel");
        let autoRecEpgrecModuleModel = <AutoRecEpgrecModuleModelInterface>modelFactory.get("AutoRecEpgrecModuleModel");
        let cancelRecEpgrecModuleModel = <CancelRecEpgrecModuleModelInterface>modelFactory.get("CancelRecEpgrecModuleModel");
        let customRecEpgrecModuleModel = <CustomRecEpgrecModuleModelInterface>modelFactory.get("CustomRecEpgrecModuleModel");
        let simpleRecEpgrecModuleModel = <SimpleRecEpgrecModuleModelInterface>modelFactory.get("SimpleRecEpgrecModuleModel");
        let epgSingleUpdateEpgrecModuleModel = <EPGSingleUpdateEpgrecModuleModelInterface>modelFactory.get("EPGSingleUpdateEpgrecModuleModel");

        //SocketIoModule の追加
        manager.addModule(new LiveRefreshStream(liveOtherStreamInfoApiModel));
        manager.addModule(new LiveRefreshTuner(liveConfigApiModel));
        manager.addModule(new StopStreamSocketIoModule(liveOtherStreamInfoApiModel));
        manager.addModule(new EnableStreamSocketIoModule(liveWatchVideoModel));
        manager.addModule(new ReservationCancelRecSocketIoModule(cancelReservationEpgrecModuleModel));
        manager.addModule(new ReservationOtherEventSocketIoModule(reservationApiModel));
        manager.addModule(new KeywordEnableSocketIoModule(enableKeywordEpgrecModuleModel));
        manager.addModule(new KeywordDeleteSocketIoModule(deleteKeywordEpgrecModuleModel));
        manager.addModule(new KeywordAddSocketIoModule(keywordApiModel));
        manager.addModule(new RecordedDeleteVideoSocketIoModule(deleteVideoEpgrecModuleModel));
        manager.addModule(new RecordedOtherEventSocketIoModule(recordedApiModel));
        manager.addModule(new ProgramAutoRecSocketIoModule(autoRecEpgrecModuleModel));
        manager.addModule(new ProgramCancelRecSocketIoModule(cancelRecEpgrecModuleModel));
        manager.addModule(new ProgramCustomRecSocketIoModule(customRecEpgrecModuleModel));
        manager.addModule(new ProgramSimpleRecSocketIoModule(simpleRecEpgrecModuleModel));
        manager.addModule(new ProgramOtherEventSocketIoModule(programApiModel));
        manager.addModule(new EPGSingleUpdateSocketIoModule(epgSingleUpdateEpgrecModuleModel));
        manager.addModule(new SearchOtherEventSocketIoModule(searchResultApiModel));
    }
}

export default SocketIoModuleAdd;

