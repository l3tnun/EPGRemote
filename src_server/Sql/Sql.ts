"use strict";

import Base from '../Base';
import CreateConnectionPool from './CreateConnectionPool';

abstract class Sql extends Base {
    protected recordName: string = this.config.getConfig().EpgrecRecordName;
    private pool = CreateConnectionPool.getPool();

    protected runQuery(query: string, callback: (row: any) => void, errCallback: (error: number) => void): void  {
        this.pool.getConnection( (err, connection) => {
            if (err) {
                this.log.system.error("Connection Pool getConnection error");
                errCallback(500);
                return;
            }

            connection.query(query, (err, rows) => {
                connection.release();
                if(err) {
                    this.log.system.error("SQL run query error");
                    this.log.system.error(String(err));
                    this.log.system.error(query);
                    errCallback(500);
                    return;
                }

                callback(rows);
            });
        });
    }

    public abstract execute(option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void;
}

export default Sql;

