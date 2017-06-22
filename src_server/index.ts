"use strict";

import * as path from 'path';
import * as minimist from 'minimist';
import Logger from './Logger';
import Configuration from './Configuration';
import ModelFactoryAdd from './Model/ModelFactoryAdd';
import CreateHandler from './CreateHandler';
import Router from './Router';
import Server from './Server';

Logger.initialize(path.join(__dirname, "../config/logConfig.json"));
Configuration.getInstance().initialize(path.join(__dirname, "../config/config.json"));

const log = Logger.getLogger();

/**
* 引数
* NODE_ENVに指定がなければ本番モードをデフォルトにする
*/
const knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'production' }
};

const options = minimist(process.argv.slice(2), knownOptions);
const isDev = (options["env"] === 'development') ? true : false;

if(!isDev) {
    process.on("uncaughtException", (error: Error) => {
        log.system.fatal("uncaughtException: " + error);
    });
}

//Model 追加
ModelFactoryAdd.init();

const handle = CreateHandler.create();
const router = new Router(handle);
const server = new Server(router);

server.start();

