"use strict";

import Controller from './Controller/Controller';
import TopPageController from './Controller/TopPageController';
import NotFoundController from './Controller/NotFoundController';
import BadRequestController from './Controller/BadRequestController';
import ResponseSpecifiedFileController from './Controller/ResponseSpecifiedFileController';

import BroadcastController from './Controller/Api/Broadcast/BroadcastController'
import LiveEnableConfigController from './Controller/Api/Live/LiveEnableConfigController';
import LiveProgramController from './Controller/Api/Live/LiveProgramController';
import LiveConfigController from './Controller/Api/Live/LiveConfigController';
import LiveWatchGetController from './Controller/Api/Live/LiveWatchGetController';
import LiveWatchDeleteController from './Controller/Api/Live/LiveWatchDeleteController';
import LiveWatchPostController from './Controller/Api/Live/LiveWatchPostController';
import LivehttpWatchController from './Controller/Api/Live/LivehttpWatchController';

import ProgramController from './Controller/Api/Program/ProgramController';
import ProgramConfigController from './Controller/Api/Program/ProgramConfigController';
import ProgramAutorecController from './Controller/Api/Program/ProgramAutorecController';
import ProgramSimpleRecController from './Controller/Api/Program/ProgramSimpleRecController';
import ProgramCancelRecController from './Controller/Api/Program/ProgramCancelRecController';
import ProgramCustomRecController from './Controller/Api/Program/ProgramCustomRecController';

import RecordedListController from './Controller/Api/Recorded/RecordedListController';
import RecordedKeywordListController from './Controller/Api/Recorded/RecordedKeywordListController';
import RecordedCategoryListController from './Controller/Api/Recorded/RecordedCategoryListController';
import RecordedChannelListController from './Controller/Api/Recorded/RecordedChannelListController';
import RecordedVideoGetController from './Controller/Api/Recorded/RecordedVideoGetController';
import RecordedVideoDeleteController from './Controller/Api/Recorded/RecordedVideoDeleteController';

import ReservationGetController from './Controller/Api/Reservation/ReservationGetController';
import ReservationDeleteController from './Controller/Api/Reservation/ReservationDeleteController';

import KeywordGetController from './Controller/Api/Keyword/KeywordGetController';
import KeywordDeleteController from './Controller/Api/Keyword/KeywordDeleteController';
import KeywordPutController from './Controller/Api/Keyword/KeywordPutController';
import KeywordPostController from './Controller/Api/Keyword/KeywordPostController';

import SearchController from './Controller/Api/Search/SearchController';
import SearchConfigController from './Controller/Api/Search/SearchConfigController';

import LogController from './Controller/Api/Log/LogController';

import EPGSingleUpdateController from './Controller/Api/Epg/EPGSingleUpdateController';

import DiskController from './Controller/Api/Disk/DiskController';

class CreateHandler {
    public static create(): { [key: string]: Controller } {
        let handle: { [key: string]: Controller } = {};

        handle["_not_found"] = new NotFoundController();
        handle["_bad_request"] = new BadRequestController();
        handle["_spcified_file"] = new ResponseSpecifiedFileController();
        handle["/:GET"] = new TopPageController();

        handle["/api/broadcast:GET"] = new BroadcastController();
        handle["/api/live/program:GET"] = new LiveProgramController();
        handle["/api/live/config:GET"] = new LiveConfigController();
        handle["/api/live/config/enable:GET"] = new LiveEnableConfigController();
        handle["/api/live/watch:GET"] = new LiveWatchGetController();
        handle["/api/live/watch:DELETE"] = new LiveWatchDeleteController();
        handle["/api/live/watch:POST"] = new LiveWatchPostController();
        handle["/api/live/http/watch:GET"] = new LivehttpWatchController();

        handle["/api/program:GET"] = new ProgramController();
        handle["/api/program/config:GET"] = new ProgramConfigController();
        handle["/api/program/autorec:PUT"] = new ProgramAutorecController();
        handle["/api/program/simplerec:PUT"] = new ProgramSimpleRecController();
        handle["/api/program/cancelrec:DELETE"] = new ProgramCancelRecController();
        handle["/api/program/customrec:PUT"] = new ProgramCustomRecController();

        handle["/api/recorded:GET"] = new RecordedListController();
        handle["/api/recorded/keyword:GET"] = new RecordedKeywordListController();
        handle["/api/recorded/category:GET"] = new RecordedCategoryListController();
        handle["/api/recorded/channel:GET"] = new RecordedChannelListController();
        handle["/api/recorded/video:GET"] = new RecordedVideoGetController();
        handle["/api/recorded/video:DELETE"] = new RecordedVideoDeleteController();

        handle["/api/reservation:GET"] = new ReservationGetController();
        handle["/api/reservation:DELETE"] = new ReservationDeleteController();

        handle["/api/keyword:GET"] = new KeywordGetController();
        handle["/api/keyword:DELETE"] = new KeywordDeleteController();
        handle["/api/keyword:PUT"] = new KeywordPutController();
        handle["/api/keyword:POST"] = new KeywordPostController();

        handle["/api/search:POST"] = new SearchController();
        handle["/api/search/config:GET"] = new SearchConfigController();

        handle["/api/log:GET"] = new LogController();

        handle["/api/epg:GET"] = new EPGSingleUpdateController();

        handle["/api/disk:GET"] = new DiskController();

        return handle;
    }
}

export default CreateHandler;

