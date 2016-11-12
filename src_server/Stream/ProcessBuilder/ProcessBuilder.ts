"use strict";

import * as child_process from 'child_process';
import Base from '../../Base';

abstract class ProcessBuilder extends Base {
    protected spawn = child_process.spawn;

    public abstract build(option: { [key: string]: any }): child_process.ChildProcess;
}

export default ProcessBuilder;

