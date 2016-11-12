"use strict";

import * as mysql from 'mysql';
import Configuration from '../Configuration';
import Logger from '../Logger';

class CreateConnectionPool {
    private static pool: mysql.IPool | null = null;

    public static getPool(): mysql.IPool {
        if(this.pool == null) {
            let config: Configuration = Configuration.getInstance();
            let log = Logger.getLogger();

            log.system.info("create sql connection");
            this.pool = mysql.createPool(config.getConfig().EpgrecDatabaseConfig);
        }

        return this.pool;
    }
}

export default CreateConnectionPool;

