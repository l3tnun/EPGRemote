"use strict";

import ApiModel from '../ApiModel';
import { GetDiskStatus } from '../../../Disk/GetDiskStatus';

class DiskModel extends ApiModel {
    public execute(): void {
        let diskPath = this.config.getConfig().epgrecConfig.videoPath;

        new GetDiskStatus().execute(diskPath, (error, stdout, stderr) => {
            if(stdout) {
                let data = stdout.split(',');
                if(data.length != 3) {
                    this.log.system.error("disk info exec stdout error: " + stdout);
                    this.errors = 500;
                } else {
                    this.results = {
                        size: this.getNumber(data[0]),
                        used: this.getNumber(data[1]),
                        available: this.getNumber(data[2])
                    }
                }
            }

            if(stderr) {
                this.log.system.error("disk exec stderr: " + stderr);
                this.errors = 500;
            }
            if (error !== null) {
                this.log.system.error("disk exec error: " + error);
                this.errors = 500;
            }
            this.eventsNotify();
        });
    }

    private getNumber(str: string): number {
        return Number( str.replace(/[^0-9^\.]/g,"") );
    }
}

export default DiskModel;

