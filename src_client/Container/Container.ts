"use strict";

import ViewModel from '../ViewModel/ViewModel';
import ModelFactory from '../ModelFactory/ModelFactory';
import NavigationViewModel from '../ViewModel/Navigation/NavigationViewModel';
import DialogViewModel from '../ViewModel/Dialog/DialogViewModel';
import PaginationViewModel from '../ViewModel/Pagination/PaginationViewModel';
import MenuViewModel from '../ViewModel/Menu/MenuViewModel';
import SnackbarViewModel from '../ViewModel/Snackbar/SnackbarViewModel';
import LiveProgramCardViewModel from '../ViewModel/Live/LiveProgramCardViewModel';
import LiveWatchViewModel from '../ViewModel/Live/Watch/LiveWatchViewModel';
import LiveWatchVideoViewModel from '../ViewModel/Live/Watch/LiveWatchVideoViewModel';
import LiveWatchOtherStreamInfoViewModel from '../ViewModel/Live/Watch/LiveWatchOtherStreamInfoViewModel';
import LiveWatchStreamInfoViewModel from '../ViewModel/Live/Watch/LiveWatchStreamInfoViewModel';
import LiveProgramDialogContentViewModel from '../ViewModel/Live/LiveProgramDialogContentViewModel';
import KeywordViewModel from '../ViewModel/Keyword/KeywordViewModel';
import KeywordInfoDialogViewModel from '../ViewModel/Keyword/KeywordInfoDialogViewModel';
import KeywordDeleteDialogViewModel from '../ViewModel/Keyword/KeywordDeleteDialogViewModel';
import LogPageViewModel from '../ViewModel/LogPage/LogPageViewModel';
import LogPageActionDialogViewModel from '../ViewModel/LogPage/LogPageActionDialogViewModel';
import RecordedViewModel from '../ViewModel/Recorded/RecordedViewModel';
import RecordedMenuViewModel from '../ViewModel/Recorded/RecordedMenuViewModel';
import RecordedDeleteVideoViewModel from '../ViewModel/Recorded/RecordedDeleteVideoViewModel';
import RecordedVideoLinkDialogViewModel from '../ViewModel/Recorded/RecordedVideoLinkDialogViewModel';
import RecordedSearchMenuViewModel from '../ViewModel/Recorded/RecordedSearchMenuViewModel';
import ReservationViewModel from '../ViewModel/Reservation/ReservationViewModel';
import ReservationDeleteDialogContentViewModel from '../ViewModel/Reservation/ReservationDeleteDialogContentViewModel';
import ReservationMenuViewModel from '../ViewModel/Reservation/ReservationMenuViewModel';
import ProgramViewModel from '../ViewModel/Program/ProgramViewModel';
import ProgramInfoDialogViewModel from '../ViewModel/Program/ProgramInfoDialogViewModel';
import ProgramStorageViewModel from '../ViewModel/Program/ProgramStorageViewModel';
import SearchViewModel from '../ViewModel/Search/SearchViewModel';
import DiskDialogViewModel from '../ViewModel/Disk/DiskDialogViewModel';
import { DialogModelInterface } from '../Model/Dialog/DialogModel';
import { SnackbarModelInterface } from '../Model/Snackbar/SnackbarModel';
import { LiveWatchVideoModelInterface } from '../Model/LiveWatchVideo/LiveWatchVideoModel';
import { LiveProgramApiModelInterface } from '../Model/Api/Live/LiveProgramApiModel';
import { BroadCastApiModelInterface } from '../Model/Api/BroadCastApiModel';
import { LiveWatchStopStreamApiModelInterface } from '../Model/Api/Live/Watch/LiveWatchStopStreamApiModel';
import { LiveOtherStreamInfoApiModelInterface } from '../Model/Api/Live/LiveOtherStreamInfoApiModel';
import { LiveWatchStreamInfoApiModelInterface } from '../Model/Api/Live/Watch/LiveWatchStreamInfoApiModel';
import { LiveConfigApiModelInterface } from '../Model/Api/Live/LiveConfigApiModel';
import { LiveStartWatchApiModelInterface } from '../Model/Api/Live/Watch/LiveStartWatchApiModel';
import { LiveRecordedStartWatchApiModelInterface } from '../Model/Api/Live/Watch/LiveRecordedStartWatchApiModel';
import { LiveConfigEnableApiModelInterface } from '../Model/Api/Live/LiveConfigEnableApiModel';
import { LiveHttpConfigApiModelInterface } from '../Model/Api/Live/LiveHttpConfigApiModel';
import { KeywordApiModelInterface } from '../Model/Api/Keyword/KeywordApiModel';
import { LogPageApiModelInterface } from '../Model/Api/LogPage/LogPageApiModel';
import { RecordedApiModelInterface } from '../Model/Api/Recorded/RecordedApiModel';
import { RecordedVideoLinkApiModelInterface } from '../Model/Api/Recorded/RecordedVideoLinkApiModel';
import { RecordedVideoConfigApiModelInterface} from '../Model/Api/Recorded/RecordedVideoConfigApiModel';
import { RecordedSearchConfigApiModelInterface } from '../Model/Api/Recorded/RecordedSearchConfigApiModel';
import { ReservationApiModelInterface } from '../Model/Api/Reservation/ReservationApiModel';
import { ProgramApiModelInterface } from '../Model/Api/Program/ProgramApiModel';
import { ProgramConfigApiModelInterface } from '../Model/Api/Program/ProgramConfigApiModel';
import { SearchConfigApiModelInterface } from '../Model/Api/Search/SearchConfigApiModel';
import { SearchKeywordConfigApiModelInterface } from '../Model/Api/Search/SearchKeywordConfigApiModel';
import { SearchResultApiModelInterface } from '../Model/Api/Search/SearchResultApiModel';
import { EnableKeywordEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/EnableKeywordEpgrecModuleModel';
import { DeleteKeywordEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/DeleteKeywordEpgrecModuleModel';
import { DeleteVideoEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/DeleteVideoEpgrecModuleModel';
import { CancelReservationEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/CancelReservationEpgrecModuleModel';
import { CancelRecEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/CancelRecEpgrecModuleModel';
import { AutoRecEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/AutoRecEpgrecModuleModel';
import { SimpleRecEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/SimpleRecEpgrecModuleModel'
import { CustomRecEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/CustomRecEpgrecModuleModel'
import { EPGSingleUpdateEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/EPGSingleUpdateEpgrecModuleModel'
import { AddKeywordEpgrecModuleModelInterface } from '../Model/Api/EpgrecModule/AddKeywordEpgrecModuleModel';
import { StorageModelInterface } from '../Model/Storage/StorageModel';
import { HlsModelInterface } from '../Model/Hls/HlsModel';
import { DiskApiModelInterface } from '../Model/Api/Disk/DiskApiModel';

/**
* Container
* ViewModel の依存関係を記述し、component から取り出せるようにする
* @throw ContinerGetError table に指定した ViewModel が無いとき起きる
*/
namespace Container {
    /**
    * 登録されている ViewModel を取り出す
    * @param name ViewModel 名
    * @throw ContinerGetError table に name で指定した ViewModel が無いとき起きる
    */
    export const get = (name: string): ViewModel => {
        let viewModel = table[name];
        if(typeof viewModel == "undefined") {
            console.log(`Continer: ${ name } is not found.`);
            throw new Error('ContinerGetError');
        }
        return viewModel;
    }

    let table: { [key: string]: ViewModel } = {};

    /**
    * ViewModel を登録する
    * @param name ViewModel 名
    * @param viewModel viewModel のインスタンス
    */
    let set = (name: string, viewModel: ViewModel) => {
        table[name] = viewModel;
    }

    /**
    * ViewModel を実際に登録する
    * gulp-typescript が別ファイルに分けられた Module を統合できないためここに書く
    */
    export const init = (): void => {
        //model の準備
        let factory = ModelFactory.getInstance();
        let dialogModel = <DialogModelInterface>factory.get("DialogModel");
        let snackbarModel = <SnackbarModelInterface>factory.get("SnackbarModel");
        let liveWatchVideoModel = <LiveWatchVideoModelInterface>factory.get("LiveWatchVideoModel");
        let liveProgramApiModel = <LiveProgramApiModelInterface>factory.get("LiveProgramApiModel");
        let broadCastApiModel = <BroadCastApiModelInterface>factory.get("BroadCastApiModel");
        let liveWatchStopStreamApiModel = <LiveWatchStopStreamApiModelInterface>factory.get("LiveWatchStopStreamApiModel");
        let liveOtherStreamInfoApiModel = <LiveOtherStreamInfoApiModelInterface>factory.get("LiveOtherStreamInfoApiModel");
        let liveWatchStreamInfoApiModel = <LiveWatchStreamInfoApiModelInterface>factory.get("LiveWatchStreamInfoApiModel");
        let liveConfigApiModel = <LiveConfigApiModelInterface>factory.get("LiveConfigApiModel");
        let liveStartWatchApiModel = <LiveStartWatchApiModelInterface>factory.get("LiveStartWatchApiModel");
        let liveRecordedStartWatchApiModel = <LiveRecordedStartWatchApiModelInterface>factory.get("LiveRecordedStartWatchApiModel");
        let liveConfigEnableApiModel = <LiveConfigEnableApiModelInterface>factory.get("LiveConfigEnableApiModel");
        let liveHttpConfigApiModel = <LiveHttpConfigApiModelInterface>factory.get("LiveHttpConfigApiModel");
        let keywordApiModel = <KeywordApiModelInterface>factory.get("KeywordApiModel");
        let logPageApiModel = <LogPageApiModelInterface>factory.get("LogPageApiModel");
        let recordedApiModel = <RecordedApiModelInterface>factory.get("RecordedApiModel");
        let recordedVideoLinkApiModel = <RecordedVideoLinkApiModelInterface>factory.get("RecordedVideoLinkApiModel");
        let recordedVideoConfigApiModel = <RecordedVideoConfigApiModelInterface>factory.get("RecordedVideoConfigApiModel");
        let recordedSearchConfigApiModel = <RecordedSearchConfigApiModelInterface>factory.get("RecordedSearchConfigApiModel");
        let reservationApiModel = <ReservationApiModelInterface>factory.get("ReservationApiModel");
        let programApiModel = <ProgramApiModelInterface>factory.get("ProgramApiModel");
        let programConfigApiModel = <ProgramConfigApiModelInterface>factory.get("ProgramConfigApiModel");
        let searchConfigApiModel = <SearchConfigApiModelInterface>factory.get("SearchConfigApiModel");
        let searchKeywordConfigApiModel = <SearchKeywordConfigApiModelInterface>factory.get("SearchKeywordConfigApiModel");
        let searchResultApiModel = <SearchResultApiModelInterface>factory.get("SearchResultApiModel");
        let enableKeywordEpgrecModuleModel = <EnableKeywordEpgrecModuleModelInterface>factory.get("EnableKeywordEpgrecModuleModel");
        let deleteKeywordEpgrecModuleModel = <DeleteKeywordEpgrecModuleModelInterface>factory.get("DeleteKeywordEpgrecModuleModel");
        let deleteVideoEpgrecModuleModel = <DeleteVideoEpgrecModuleModelInterface>factory.get("DeleteVideoEpgrecModuleModel");
        let cancelReservationEpgrecModuleModel = <CancelReservationEpgrecModuleModelInterface>factory.get("CancelReservationEpgrecModuleModel");
        let cancelRecEpgrecModuleModel = <CancelRecEpgrecModuleModelInterface>factory.get("CancelRecEpgrecModuleModel");
        let autoRecEpgrecModuleModel = <AutoRecEpgrecModuleModelInterface>factory.get("AutoRecEpgrecModuleModel");
        let simpleRecEpgrecModuleModel = <SimpleRecEpgrecModuleModelInterface>factory.get("SimpleRecEpgrecModuleModel");
        let customRecEpgrecModuleModel = <CustomRecEpgrecModuleModelInterface>factory.get("CustomRecEpgrecModuleModel");
        let epgSingleUpdateEpgrecModuleModel = <EPGSingleUpdateEpgrecModuleModelInterface>factory.get("EPGSingleUpdateEpgrecModuleModel");
        let addKeywordEpgrecModuleModel = <AddKeywordEpgrecModuleModelInterface>factory.get("AddKeywordEpgrecModuleModel");
        let storageModel = <StorageModelInterface>factory.get("StorageModel");
        let hlsModel = <HlsModelInterface>factory.get("HlsModel");
        let diskApiModel = <DiskApiModelInterface>factory.get("DiskApiModel");

        //Navigation
        set("NavigationViewModel", new NavigationViewModel(
            broadCastApiModel,
            liveOtherStreamInfoApiModel,
            liveConfigEnableApiModel,
            liveHttpConfigApiModel
        ));

        //dialog
        set("DialogViewModel", new DialogViewModel(dialogModel));

        //pagination
        set("PaginationViewModel", new PaginationViewModel());

        //menu
        set("MenuViewModel", new MenuViewModel());

        //Snackbar
        set("SnackbarViewModel", new SnackbarViewModel(snackbarModel));

        // /live
        set("LiveProgramCardViewModel", new LiveProgramCardViewModel(liveProgramApiModel));
        set("LiveWatchViewModel", new LiveWatchViewModel(
            broadCastApiModel,
            liveWatchStopStreamApiModel,
            liveConfigEnableApiModel
        ));
        set("LiveWatchVideoViewModel", new LiveWatchVideoViewModel(
            liveWatchVideoModel,
            liveOtherStreamInfoApiModel,
            hlsModel
        ));
        set("LiveWatchOtherStreamInfoViewModel",
            new LiveWatchOtherStreamInfoViewModel(liveOtherStreamInfoApiModel)
         );
        set("LiveWatchStreamInfoViewModel",
            new LiveWatchStreamInfoViewModel(liveWatchStreamInfoApiModel)
        );
        set("LiveProgramDialogContentViewModel",
            new LiveProgramDialogContentViewModel(
                liveConfigApiModel,
                liveStartWatchApiModel,
                epgSingleUpdateEpgrecModuleModel,
                liveConfigEnableApiModel,
                liveHttpConfigApiModel,
                liveWatchStreamInfoApiModel
            )
        );

        // /log
        set("LogPageViewModel", new LogPageViewModel(logPageApiModel));
        set("LogPageActionDialogViewModel", new LogPageActionDialogViewModel());

        // reservation
        set("ReservationViewModel", new ReservationViewModel(reservationApiModel));
        set("ReservationDeleteDialogContentViewModel", new ReservationDeleteDialogContentViewModel(
            cancelReservationEpgrecModuleModel
        ));
        set("ReservationMenuViewModel", new ReservationMenuViewModel());

        // /keyword
        set("KeywordViewModel", new KeywordViewModel(keywordApiModel, enableKeywordEpgrecModuleModel));
        set("KeywordInfoDialogViewModel", new KeywordInfoDialogViewModel(deleteKeywordEpgrecModuleModel));
        set("KeywordDeleteDialogViewModel", new KeywordDeleteDialogViewModel(deleteKeywordEpgrecModuleModel));

        // /recorded
        set("RecordedViewModel", new RecordedViewModel(recordedApiModel));
        set("RecordedMenuViewModel", new RecordedMenuViewModel());
        set("RecordedDeleteVideoViewModel", new RecordedDeleteVideoViewModel(deleteVideoEpgrecModuleModel));
        set("RecordedVideoLinkDialogViewModel", new RecordedVideoLinkDialogViewModel(
                recordedVideoLinkApiModel,
                recordedVideoConfigApiModel,
                liveConfigEnableApiModel,
                liveRecordedStartWatchApiModel
        ));
        set("RecordedSearchMenuViewModel", new RecordedSearchMenuViewModel(recordedSearchConfigApiModel));

        //program
        set("ProgramViewModel", new ProgramViewModel(
            programApiModel,
            programConfigApiModel,
            liveConfigEnableApiModel
        ));
        set("ProgramInfoDialogViewModel", new ProgramInfoDialogViewModel(
            cancelRecEpgrecModuleModel,
            autoRecEpgrecModuleModel,
            simpleRecEpgrecModuleModel,
            customRecEpgrecModuleModel
        ));
        set("ProgramStorageViewModel", new ProgramStorageViewModel(storageModel));

        //search
        set("SearchViewModel", new SearchViewModel(
            searchConfigApiModel,
            searchKeywordConfigApiModel,
            searchResultApiModel,
            addKeywordEpgrecModuleModel
        ));

        //diskDialog
        set("DiskDialogViewModel", new DiskDialogViewModel(diskApiModel));
    }
}

export default Container;

