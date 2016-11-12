/**
* config.json の定義
*/
interface ConfigInterface {
    serverPort: number;
    enableLiveStream: boolean;
    enableRecordedStream: boolean;

    broadcast: {
        GR: boolean,
        BS: boolean,
        CS: boolean,
        EX: boolean,
    };

    liveVideoSetting: {
        id: number,
        name: string,
        command: string
    }[];

    recordedVideoSetting: {
        id: number,
        name: string,
        command: string
    }[];

    tuners: {
        id: number,
        name: string,
        types: string[],
        command: string
    }[];

    streamFilePath: string;
    maxStreamNumber: number;

    EpgrecDatabaseConfig: {
        multipleStatements: boolean,
        host: string,
        user: string,
        password: string,
        database: string,
        timeout: number
    }

    EpgrecRecordName: string;

    epgrecConfig: {
        host: string,
        videoPath: string,
        thumbsPath: string,
        recMode: {
            id: number,
            name: string
        }[],
        recModeDefaultId: number,
        startTranscodeId: number
    };

    programLength: number;

    programViewConfig: {
        tablet: {
            timeHeight:      number,
            timeWidth:       number,
            timeFontSize:    number,
            stationHeight:   number,
            stationWidth:    number,
            stationFontSize: number,
            titleSize:       number,
            timeSize:        number,
            descriptionSize: number
        },
        mobile: {
            timeHeight:      number,
            timeWidth:       number,
            timeFontSize:    number,
            stationHeight:   number,
            stationWidth:    number,
            stationFontSize: number,
            titleSize:       number,
            timeSize:        number,
            descriptionSize: number
        }
    };

    RecordedStreamingiOSURL: string;
    RecordedDownloadiOSURL: string;
}

export default ConfigInterface;
