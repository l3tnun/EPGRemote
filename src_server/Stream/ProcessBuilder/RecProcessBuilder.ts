"use strict";

import * as child_process from 'child_process';
import ProcessBuilder from './ProcessBuilder';
import TunerManager from '../../TunerManager';

class RecProcessBuilder extends ProcessBuilder {
    public build(option: { [key: string]: any }): child_process.ChildProcess {
        let tunerManager = TunerManager.getInstance();
        let tunerConfig = tunerManager.getTunerCommand(option["tunerId"], option["sid"], option["channel"]).split(" ");
        let tunerCmd = tunerConfig.shift();

        let recChild = this.spawn(tunerCmd!, tunerConfig);
        this.log.stream.info(`run rec command pid : ${recChild.pid}`);

        recChild.stderr.on('data', (data) => { this.log.stream.debug(`rec: ${data}`); });

        return recChild;
    }
}

export default RecProcessBuilder;

