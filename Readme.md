EPGRemote
====

epgrecUNA の HLS View + スマートフォン & タブレット用 Web UI (Node.js)

## これはなに？

epgrecUNA 用の後方支援プログラムです。epgrecUNA の番組情報を使用して HLS(HTTP Live Streaming) や http でリアルタイムに視聴を可能にします。

[dailymotion/hls.js](https://github.com/dailymotion/hls.js/tree/master) を使用しているため、HLS 非対応ブラウザ(Desktop版 Chrome, Firefox など)でも視聴可能です。

*  現在放送中の番組のリアルタイム配信(HLS or http)
*  録画済みの番組の配信(HLS or http)
*  スマートフォン & タブレット用の epgrecUNA の Web UI
    * 番組表一覧
    * 録画済み一覧
    * 録画予約一覧
    * 番組検索、自動録画キーワードの作成、更新
    * 自動録画キーワードの管理
    * epgrecUNA 動作ログ表示機能

HLS でのリアルタイム視聴は CPU にとってかなり重たい処理となります。スペックに余裕があるマシンで動かしてください。
QSV や NVEnc 等のハードウェアエンコードを使うことをおすすめします。

http 配信(モバイル版)の場合は iOS や Android しか再生できませんが、mpeg2ts をそのまま配信可能なので低スペックマシンでも配信が可能になります。
その分クライアントでの再生が大変ですが、Android で mpeg2 デコーダーが搭載されたものであれば問題無いはずです。

ffmpeg の設定については [v42fg3g/TvRemoteViewer_VB](https://github.com/v42fg3g/TvRemoteViewer_VB/) を参考にさせていただきました。作者さんありがとうございます。

## スクリーンショット (タブレット UI)
<img src="https://github.com/l3tnun/EPGRemote/wiki/images/demo/top.png" width=430px>
<img src="https://github.com/l3tnun/EPGRemote/wiki/images/demo/live_program.png" width=430px>
<img src="https://github.com/l3tnun/EPGRemote/wiki/images/demo/live_watch.png" width=430px>
<img src="https://github.com/l3tnun/EPGRemote/wiki/images/demo/program.png" width=430px>
<img src="https://github.com/l3tnun/EPGRemote/wiki/images/demo/recorded.png" width=430px>
<img src="https://github.com/l3tnun/EPGRemote/wiki/images/demo/reservation.png" width=430px>
<img src="https://github.com/l3tnun/EPGRemote/wiki/images/demo/search.png" width=430px>
<img src="https://github.com/l3tnun/EPGRemote/wiki/images/demo/keyword.png"width=430px>
<img src="https://github.com/l3tnun/EPGRemote/wiki/images/demo/log.png" width=430px>

## 使用ツール
* Node.js v6.9.1 以降
* ffmpeg なるべく新しい物を使用してください

## インストール方法
* Node.js をインストール後、以下のコマンドを実行

````
$ git clone https://github.com/l3tnun/EPGRemote.git
$ cd EPGRemote
$ npm install
$ npm run build
```` 

* EPGRemote で必要な php ファイルを epgrecUNA のディレクトリにコピーする(番組検索で使用します)

````
cp -r php/epgremote /var/www/epgrec/
````

* HLSでリアルタイム視聴を行う場合、ffmpeg と recpt1 (BondriverProxyEx + recbond 推奨) 等が必要です

## アップデート方法
* 以下のコマンドを実行後に EPGRemote を再起動する

```
$ git pull
$ npm update
$ npm run build
```

## EPGRemote 設定
### config の設定
* sample をコピーする

````
$ cp config/config.json.sample config/config.json
$ cp config/logConfig.json.sample config/logConfig.json
````

##### logConfig.json の設定をする

````
# filename を適切に書き換える
$ vim config/logConfig.json
````

##### config.json を設定する
````
#config.json を編集
vim config/config.json
````

* config.json 解説

````
{
    //Webからアクセスするときに使用するポート番号
    "serverPort" : "8888",

    //放送中番組の HLS 配信を有効にするか true: 有効, false: 無効
    "enableLiveStream" : true,
    //放送中番組の http 配信(モバイル版)を有効にするか true: 有効, false: 無効
    "enableLiveHttpStream" : true,
    //放送中番組の http 配信(PC 限定)を有効にするか true: 有効, false: 無効
    "enableLivePCHttpStream" : false,
    //録画済みファイルの HLS 配信を有効にするか true: 有効, false: 無効
    "enableRecordedStream" : true,

    //放送波の設定。epgrecUNA で有効になっているものを true に設定する
    "broadcast" :  { "GR" : true, "BS" : true, "CS" : true, "EX" : false },

    //放送中番組の HLS 配信で使用される ffmpeg の設定
    //enableLiveStream が false の場合必要ない
    "liveVideoSetting" : [
        {
            "id"      : 1,                //設定を一意に特定するためのID, 重複禁止
            "name"    : "1280x720(main)", //Web UI で表示される名前
            //ffmpeg コマンド
            //ffmpeg と ffpreset のパスはフルパスで指定する
            "command" : "/usr/local/bin/ffmpeg -re -dual_mono_mode main -i pipe:0 -f hls -hls_time 3 -hls_list_size 17 -hls_allow_cache 1 -hls_segment_filename  <streamFilesDir>/stream<streamNum>-%09d.ts -threads auto -acodec libfdk_aac -ar 48000 -ab 192k -ac 2 -vcodec libx264 -s 1280x720 -filter:v yadif -aspect 16:9 -vb 3000k -fpre /hoge/libx264-hls.ffpreset <streamFilesDir>/stream<streamNum>.m3u8"
         }, ...
    ],

	//放送中番組の http 配信(モバイル版)で使用される ffmpeg の設定
    //enableLiveHttpStream が false の場合必要ない
    "liveHttpVideoSetting" : [
        {
            "id"      : 1,              //設定を一意に特定するためのID, 重複禁止
            "name"    : "無変換(主音声)", //Web UI で表示される名前
            //ffmpeg コマンド
            "command" : "/usr/local/bin/ffmpeg -re -dual_mono_mode main -i pipe:0 -acodec libfdk_aac -ar 48000 -ab 192k -ac 2 -vcodec copy -f mpegts -movflags frag_keyframe+empty_moov pipe:1"
        }, ...
    ],

    //放送中番組の http 配信(PC 限定)で使用される ffmpeg の設定 (mp4のみ)
    //enableLivePCHttpStream が false の場合必要ない
    "liveHttpVideoSetting" : [
        {
            "id"      : 1,                //設定を一意に特定するためのID, 重複禁止
            "name"    : "1280x720(main)", //Web UI で表示される名前
            //ffmpeg コマンド
            "command" : "/usr/local/bin/ffmpeg -re -dual_mono_mode main -i pipe:0 -s 1280x720 -filter:v yadif -aspect 16:9 -c:v libx264 -b:v 3000k -c:a libfdk_aac -ar 48000 -ab 192k -ac 2 -f mp4 -movflags empty_moov pipe:1"
        }, ...
    ],

    //録画済みファイルの HLS 配信で使用される ffmpeg の設定
    //enableRecordedStream が false の場合必要ない
    "recordedVideoSetting" : [
        {
            "id"     : 1,                //設定を一意に特定するためのID, 重複禁止
            "name"   : "1280x720(main)", //Web UI で表示される名前
            //ffmpeg コマンド
            //ffmpeg や ffpreset 等のパスはフルパスで指定する
            "command" : "/usr/local/bin/ffmpeg -re -dual_mono_mode main -i <input> -f hls -hls_time 3 -hls_list_size 0 -hls_allow_cache 1 -hls_segment_filename  <streamFilesDir>/stream<streamNum>-%09d.ts -threads auto -acodec libfdk_aac -ar 48000 -ab 128k -ac 2 -vcodec libx264 -s 720x480 -aspect 16:9 -vb 1500k -fpre /hoge/libx264-hls.ffpreset <streamFilesDir>/stream<streamNum>.m3u8"

        }, ...
    ]

    //HLS で使用する配信時のチューナー設定
    //enableLiveStream が false の場合必要ない
    "tuners": [
        {
            "id"        : 1,         //設定を一意に特定するためのID, 重複禁止
            "name"      : "PT3-T1",  //Web UI でチューナーを識別するための名前
            "types"     : [ "GR" ],  //有効な放送波
            //放送を受信するためのコマンド
            "command"   : "/usr/local/bin/recbond --driver /hoge/BonDriver_Proxy-T.so --sid <sid> <channel> - - "
        }, ...
    ],

    //HLS の一時ファイルの保存ディレクトリパス、フルパスで指定する
    //enableLiveStream と enableRecordedStream の両方が false の場合必要ない
    "streamFilePath" : "/hoge/streamfiles",

    //HLS の最大同時視聴数
    //enableLiveStream, enableRecordedStream, enableLiveHttpStream, enableLivePCHttpStream の全てが false の場合必要ない
    "maxStreamNumber" : 4,

    //epgrecUNA のデータベース(MySQL) にアクセスする設定
    "EpgrecDatabaseConfig" : {
        "host": "localhost",
        "user": "epgrec",
        "password": "epgrec",
        "database": "epgrec",
        "timeout": 5000
    },

    //epgrecUNAで設定したテーブル接頭辞
    "EpgrecRecordName" : "Recorder_",

    //epgrecUNA の設定
    "epgrecConfig" : {
        "host" : "http://127.0.0.1:1180",        //ホスト
        "openHost": "http://192.168.11.2:1180",  //epgrec UNA の外部アクセス用ホスト (kodi で使用する)
        "rootPath": "/var/www/epgrec",           //epgrec UNA の root ディレクトリパス (kodi で使用する)
        "videoPath" : "/var/www/epgrec/video",   //録画ファイルが保存されているディレクトリのパス
        "thumbsPath" : "/var/www/epgrec/thumbs", //サムネイルが保存されているディレクトリのパス
        //epgre UNA の予約カスタマイズの録画モード id は 0 から順につける
        "recMode" : [
                        { "id" : 0, "name" : "Full TS" },
                        { "id" : 1, "name" : "HD TS" },
                        { "id" : 2, "name" : "SD TS" },
                        { "id" : 3, "name" : "H264-HD" },
                        { "id" : 4, "name" : "H264-SD" }
                    ],
        //epgrecUNA の予約カスタマイズの録画モードのデフォルト値 この場合 H264-HD になる
        "recModeDefaultId" : 3,
        //epgrecUNA 自動予約のトランスコードのプルダウン開始位置 この場合プルダウンには H264-HD, H264-SD の2つが表示される
        "startTranscodeId" : 3
    },

    //GR の並べ替え設定 channel_disc を設定する。
    //必須設定ではない。設定する場合は全ての channel_disc の記述を行う事
    //以下のchannelMapBS, channelMapCS, channelMapEX も同じ
    "channelMapGR": [ "GR20_26624", "GR20_26625", "GR13_1032", ... ],
    "channelMapBS": [ ... ],
    "channelMapCS": [ ... ],
    "channelMapEX": [ ... ],

    "programLength": 8, //番組表1ページで表示する時間

    //番組表の設定
    "programViewConfig": {
        //タブレット用設定
        "tablet": {
            "timeHeight":      180,  //１時間あたりの高さ
            "timeWidth":       30,   //時刻の横幅
            "timeFontSize":    17,   //時刻のフォントサイズ
            "stationHeight":   30,   //局名の高さ
            "stationWidth":    140,  //局名の幅
            "stationFontSize": 15,   //局名のフォントサイズ
            "titleSize":       10,   //番組のタイトルのフォントサイズ
            "timeSize":        10,   //番組の開始時刻のフォントサイズ
            "descriptionSize": 10    //番組の詳細のフォントサイズ
        },
        //スマートフォン用設定
        "mobile": {
            "timeHeight":      120,
            "timeWidth":       20,
            "timeFontSize":    12,
            "stationHeight":   20,
            "stationWidth":    100,
            "stationFontSize": 12,
            "titleSize":       7.5,
            "timeSize":        7.5,
            "descriptionSize": 7.5
        }
    },

    //ios の録画済み一覧の URL Scheme の設定
    //下記の設定の場合、視聴には infuse が DL では VLC が起動する
    //必要なければ削除しても良い
    "RecordedStreamingiOSURL": "infuse://x-callback-url/play?url=http://ADDRESS",
    "RecordedDownloadiOSURL": "vlc-x-callback://x-callback-url/download?url=http://ADDRESS",

    //android の録画済み一覧の URL Scheme の設定
    //下記の設定の場合、視聴には MX Player が DL では Advanced Download Manager が起動する
    //必要なければ削除しても良い
    "RecordedStreamingAndroidURL": "android-app://com.mxtech.videoplayer.ad/http/ADDRESS",
    "RecordedDownloadAndroidURL": "android-app://com.dv.adm/http/ADDRESS",


    //http 配信の視聴アプリの設定
    //enableLiveHttpStream が true の場合必須
    //iOS は VLC, Android は MX Player で動作確認済み
    "HttpLiveViewiOSURL" : "vlc-x-callback://x-callback-url/stream?url=http://ADDRESS",
    "HttpLiveViewAndroidURL": "intent://ADDRESS#Intent;package=com.mxtech.videoplayer.ad;type=video;scheme=http;end",

    //Windows 用のカスタム URL Scheme の設定
    //IE or Edge でしか正常に動作しない
    //必要なければ削除しても良い
    "RecordedStreamingWindowsURL": "custom:///http://ADDRESS"

}
````

### epgrecUNA の設定 (推奨)
* サムネイル作成の機能を有効化する (サムネイルのサイズ 320x180 以上に変更することを推奨)
* epgrecUNA と EPGRemote のチューナーの取り合いを回避するため、BonDriverProxyEx + recbond のインストールする。
* トランスコード設定を有効化してスマホ等で録画済み番組を再生可能にする。
 * エンコードなしで ts ファイルを直接再生も可能ですが、スマートフォン、タブレット側にそれなりの性能が必要になります。
 * また、エンコードなしではPCで再生できません。(VLC の web plugin を入れれば別ですが)

## 使い方
以下のコマンドで実行されます。

````
node build-server/index.js
````

or

````
npm start
````

エラーが出て起動しない時は、 config.json、 logConfig.json の設定を見直してみてください。

ログファイルの保存場所や streamFilePath のディレクトリが作成されていないと落ちます。

サービス化については pm2 等で各自で行ってください。

## Android での web アプリ化
Android の Chrome で以下のように開くとホーム画面に追加時に web アプリ化されます。

```
http://hostIP:PORT/#/?mobile=1
```

## Android 6.0 以降で番組表が重いぞ、という方へ
設定のユーザー補助機能で "操作の監視" を行っているアプリが原因のようで、これらを OFF にすると問題は解消されました。

具体的なアプリは LMT Launcher や Pie Control などが挙げられます。

もしくは、LineageOS がリリースしている [Gello](https://github.com/LineageOS/android_packages_apps_Gello/releases) というブラウザでは問題は発生していないので、そちらで使用すると良いです。

また、Google Play Store には Gello をベースにした [Pyrope Browser](https://play.google.com/store/apps/details?id=com.ninnix96.pyrope.browser) があるようなので、そちらでも良いと思います。

<img src="https://github.com/l3tnun/EPGRemote/wiki/images/Readme/android6.0_accessibility.png" width="250px">

## 動作確認済みブラウザ
* Firefox (Android 版は一応動作可)
* Chrome (Android 版を含む)
* Safari (iOS 版を含む)
* Edge (Windows Phone 未確認)

## Licence

一応 MIT Licence としておきます。
