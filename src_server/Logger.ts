"use strict";

import * as log4js from 'log4js';

interface LoggerInterface {
    system: log4js.Logger;
    access: log4js.Logger;
    stream: log4js.Logger;
}

class Logger {
    private static logger: LoggerInterface | null = null;

    public static initialize(logPath: string): void {
        log4js.configure(logPath);

        this.logger = {
            system: log4js.getLogger('system'),
            access: log4js.getLogger('access'),
            stream: log4js.getLogger('stream')
        };
    }

    public static getLogger(): LoggerInterface {
        if(this.logger == null) { throw new Error("Please Logger initialize."); }
        return this.logger;
    }
}

export default Logger;

