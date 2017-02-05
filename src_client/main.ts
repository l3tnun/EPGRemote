"use strict";

import * as m from 'mithril';
import Container from './Container/Container';
import ModelFactoryAdd from './ModelFactory/ModelFactoryAdd';
import SocketIoModuleAdd from './SocketIo/SocketIoModuleAdd';
import SocketIoDisconnect from './SocketIo/SocketIoDisconnect';
import TopPageComponent from './Component/TopPage/TopPageComponent';
import LiveProgramComponent from './Component/Live/Program/LiveProgramComponent';
import LiveWatchComponent from './Component/Live/Watch/LiveWatchComponent';
import RecordedComponent from './Component/Recorded/RecordedComponent';
import ReservationComponent from './Component/Reservation/ReservationComponent'
import KeywordComponent from './Component/Keyword/KeywordComponent';
import LogPageComponent from './Component/LogPage/LogPageComponent';
import ProgramComponent from './Component/Program/ProgramComponent';
import SearchComponent from './Component/Search/SearchComponent';

ModelFactoryAdd.init(); //model の設定
Container.init(); //viewModel の設定
SocketIoModuleAdd.init(); //SocketIoModule の設定
SocketIoDisconnect.init(); //SocketIo 切断時の設定

m.route.prefix("#");
m.route(document.body, "/", {
    "/": new TopPageComponent(),
    "/live/program":new LiveProgramComponent(),
    "/live/watch":  new LiveWatchComponent(),
    "/program":     new ProgramComponent(),
    "/recorded":    new RecordedComponent(),
    "/reservation": new ReservationComponent(),
    "/keyword":     new KeywordComponent(),
    "/search":      new SearchComponent(),
    "/log":         new LogPageComponent()
});

