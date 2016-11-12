"use strict";

import Stream from './Stream';

class StreamStatus {
    public stream: Stream | null = null;
    public viewStatus: boolean = false;
    public changeChannelStatus: boolean = true;
}

export default StreamStatus;

