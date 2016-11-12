/**
* HLS.js の定義ファイル
* 必要な部分の定義のみしてある
*/
declare module HLS {
    export class Hls {
        static Events: {
            MEDIA_ATTACHING: 'hlsMediaAttaching';
            MEDIA_ATTACHED: 'hlsMediaAttached';
            MEDIA_DETACHING: 'hlsMediaDetaching';
            MEDIA_DETACHED: 'hlsMediaDetached';
            BUFFER_RESET: 'hlsBufferReset';
            BUFFER_CODECS: 'hlsBufferCodecs';
            BUFFER_CREATED: 'hlsBufferCreated';
            BUFFER_APPENDING: 'hlsBufferAppending';
            BUFFER_APPENDED: 'hlsBufferAppended';
            BUFFER_EOS: 'hlsBufferEos';
            BUFFER_FLUSHING: 'hlsBufferFlushing';
            BUFFER_FLUSHED: 'hlsBufferFlushed';
            MANIFEST_LOADING: 'hlsManifestLoading';
            MANIFEST_LOADED: 'hlsManifestLoaded';
            MANIFEST_PARSED: 'hlsManifestParsed';
            LEVEL_LOADING: 'hlsLevelLoading';
            LEVEL_LOADED: 'hlsLevelLoaded';
            LEVEL_UPDATED: 'hlsLevelUpdated';
            LEVEL_PTS_UPDATED: 'hlsLevelPtsUpdated';
            LEVEL_SWITCH: 'hlsLevelSwitch';
            AUDIO_TRACKS_UPDATED: 'hlsAudioTracksUpdated';
            AUDIO_TRACK_SWITCH: 'hlsAudioTrackSwitch';
            AUDIO_TRACK_LOADING: 'hlsAudioTrackLoading';
            AUDIO_TRACK_LOADED: 'hlsAudioTrackLoaded';
            FRAG_LOADING: 'hlsFragLoading';
            FRAG_LOAD_PROGRESS: 'hlsFragLoadProgress';
            FRAG_LOAD_EMERGENCY_ABORTED: 'hlsFragLoadEmergencyAborted';
            FRAG_LOADED: 'hlsFragLoaded';
            FRAG_PARSING_INIT_SEGMENT: 'hlsFragParsingInitSegment';
            FRAG_PARSING_USERDATA: 'hlsFragParsingUserdata';
            FRAG_PARSING_METADATA: 'hlsFragParsingMetadata';
            FRAG_PARSING_DATA: 'hlsFragParsingData';
            FRAG_PARSED: 'hlsFragParsed';
            FRAG_BUFFERED: 'hlsFragBuffered';
            FRAG_CHANGED: 'hlsFragChanged';
            FPS_DROP: 'hlsFpsDrop';
            FPS_DROP_LEVEL_CAPPING: 'hlsFpsDropLevelCapping';
            ERROR: 'hlsError';
            DESTROYING: 'hlsDestroying';
            KEY_LOADING: 'hlsKeyLoading';
            KEY_LOADED: 'hlsKeyLoaded';
            STREAM_STATE_TRANSITION: 'hlsStreamStateTransition'
        };

        static isSupported(): boolean;
        attachMedia(media: Element): void;
        detachMedia(): void;
        loadSource(url: string): void;
        startLoad(startPosition?: number): void;
        stopLoad(): void;
        destroy(): void;
        on(str: string, cb: () => void): void;
    }
}

import Hls = HLS.Hls;

