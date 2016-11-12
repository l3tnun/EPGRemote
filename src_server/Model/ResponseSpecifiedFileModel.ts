"use strict";

import * as path from 'path';
import Model from './Model';

class ResponseSpecifiedFileModel extends Model {
    private filePath: string;

    public execute(): void {
        let configJson = this.config.getConfig();
        let uri = <string>this.option["uri"];

        if (uri.match(/streamfiles/)) {
            this.filePath = path.join(configJson.streamFilePath, path.basename(uri));
        } else if(uri.split(path.sep)[1] == "thumbs" && path.extname(uri) == ".jpg") {
            this.filePath = decodeURIComponent(path.join(configJson.epgrecConfig.thumbsPath, path.basename(uri)));
        } else if(uri.split(path.sep)[1] == "video") {
            let urlList = uri.split(path.sep);
            let urlPath = "";
            for(let i = 2; i < urlList.length; i++) { urlPath = path.join(urlPath, decodeURIComponent(urlList[i]) ); }
            this.filePath = path.join(configJson.epgrecConfig.videoPath, urlPath);
        } else {
            this.filePath = path.join(this.config.getRootPath(), "../", uri);
        }

        this.eventsNotify();
    }

    //View からアクセスする
    public getFilePath(): string {
        return this.filePath;
    }
}

export default ResponseSpecifiedFileModel;

