"use strict";

import * as mysql from 'mysql';
import Configuration from '../Configuration';
import Logger from '../Logger';

class CreateConnectionPool {
    private static pool: mysql.IPool | null = null;

    public static getPool(): mysql.IPool {
        if(this.pool == null) {
            let log = Logger.getLogger();
            let config = Configuration.getInstance().getConfig().EpgrecDatabaseConfig;
            config.multipleStatements = true;
            if(typeof config.timeout == "undefined") { config.timeout = 5000; }

            log.system.info("create sql connection");
            this.pool = mysql.createPool(config);
        }

        return this.pool;
    }
}

export default CreateConnectionPool;

