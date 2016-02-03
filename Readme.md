EPGRemote
====

EPGRec UNA の HLS View + 番組表簡易 Web UI (Node.js)

## これはなに？

EPGRec UNA 用の後方支援プログラムです。EPGRec UNA の番組情報を使用して HLS(HTTP Live Streaming) でリアルタイムに視聴可能にします。

* 機能
 *  現在放送中の番組のリアルタイム配信(HLS)
 *  スマートフォン用の EPGRec UNA の 簡易 Web UI
     * 番組表一覧 (簡易予約、詳細予約、自動予約禁止に対応)
     * 録画済み一覧 (ts or EPGRec UNA でエンコード済み動画ファイル をスマートフォンの任意のアプリで再生する機能)
     * 録画予約一覧
     * 自動録画キーワードの管理

HLSでのリアルタイム視聴は CPU にとってかなり重たい処理となります。スペックに余裕があるマシンで動かしてください。

ffmpeg の設定については [v42fg3g/TvRemoteViewer_VB](https://github.com/v42fg3g/TvRemoteViewer_VB/) を参考にさせていただきました。作者さんありがとうございます。


Node.js + HTML + CSS + Jquery を書くのはこれが初めてです。温かい目で見守ってください。

## スクリーンショット
<img src="https://github.com/l3tnun/EPGRemote/wiki/images/Readme/hls_program_list.PNG" width="250px">
<img src="https://github.com/l3tnun/EPGRemote/wiki/images/Readme/epgrec_program_list1.PNG" width="250px">
<img src="https://github.com/l3tnun/EPGRemote/wiki/images/Readme/epgrec_program_list2.PNG" width="250px">
<img src="https://github.com/l3tnun/EPGRemote/wiki/images/Readme/epgrec_Recorded_list1.PNG" width="250px">
<img src="https://github.com/l3tnun/EPGRemote/wiki/images/Readme/epgrec_Recorded_list2.PNG" width="250px">
<img src="https://github.com/l3tnun/EPGRemote/wiki/images/Readme/program_download.PNG" width="250px">

## 使用ツール
* Node.js version v5.2.0以降
* ffmpeg なるべく新しい物を使用してください

## インストール方法
* リポジトリをクローン

````
git clone https://github.com/l3tnun/EPGRemote.git
````

* nvm などで Node.js をインストールしてください
* npm で MySQL, log4js, Socket.IO をインストール

````
$ npm install -g mysql log4js socketio request
```` 

* HLSでリアルタイム視聴を行う場合、ffmpeg と recpt1 等が必要です
* 必須ではありませんが、EPGRec UNA とのチューナーの取り合いを回避するため、BonDriverProxy + recbond のインストールを推奨します。

* 録画済み一覧から動画を再生する場合は、EPGrec UNA のエンコード機能とサムネイル作成機能を ON にしておくことを推奨します
* エンコードなしで ts ファイルを直接再生も可能ですがスマートフォン側にそれなりの性能が必要になります。

* 番組表 Web UIを使用する際には EPGRec UNA のindex.php 内の $programs の内容が必要になります。$programs を Json で返すようにしてください。

````
$ cd 'EPGRec UNA のディレクトリ'
$ cp index.php index2.php
````
* index2.php の最後の行を以下のように修正

修正前

````
$smarty->display('index.html');
?>
````

修正後

````
//$smarty->display('index.html');
print_r (json_encode($programs));
?>
````

* http://Epgrec UNAアドレス/index2.php にアクセスして Json データが取得できることを確認してください。

* config.json.sample, logConfig.json.sample をコピーして設定します。index.jsと同じ場所に置いてください
* logConfig.json については log4js でログの出力を行うために書いてあります。filename の部分がログファイルの保存先なので適当に変えてください

````
$ cp config.json.sample config.json
$ cp logConfig.json.sample logConfig.json
````

config.json 設定

````
{
	"serverIP" : "192.168.xx.xx", //サーバのIPアドレス
    "serverPort" : "8888", //Webからアクセスするときに使用するポート番号
    
    //EPGRec UNAの設定
    "epgrecConfig" : {
        "host" : "192.168.xx.xx:xxxx", //EPGRec UNAが動いてるホストの IP
        "index.php" : "index2.php",     //番組表データ取得のための php ファイルの名前 
        "hourheight" : 180, //EPGRec UNA で設定した1時間あたりの高さ
        "videoPath" : "/var/www/epgrec/video", //EPGRec UNA の録画ファイルが保存されているディレクトリのパス
        "thumbsPath" : "/var/www/epgrec/thumbs" //EPGRec UNA の録画ファイルのサムネイルが保存されているディレクトリのパス
    },

    //ffmpegで使用するビデオサイズ等の設定
    "video" : [
        {
            "id" : "1",           //設定を一意に特定するためのID、重複禁止
            "size" : "1280x720", //ビデオサイズ
            "vb" : "3000k",       //ビデオビットレート
            "ab" : "192k",        //音声ビットレート
            "audioMode" : "main"  //主音声、副音声の設定 "main" or "sub"
        }, ...

    //チューナの設定
    "tuners": [
        {
            "id" : "1",                   //設定を一意に特定するためのID、重複禁止
            "name"      : "PX-W3U3-S1",   //Web UIでチューナを識別するための名前
            "types"     : [ "BS", "CS" ], //チューナタイプ GR, CS, BS, EX が設定可能
            //録画コマンド フルパスで書く
            "command"   : "/hoge/recpt1 --device /dev/pt3video0 --b25 --strip --sid <sid> <channel> - - "
        }, ...
     
     //ffmpeg の設定 フルパスで書く
     //-vcodec, -acodecなどは各自の環境に合わせて書く
     "ffmpeg": {
        "command" : "/ffmpeg_path/ffmpeg -re -dual_mono_mode <audioMode> -i pipe:0 -f hls -hls_time 3 -hls_list_size 17 -hls_allow_cache 1 -hls_segment_filename  <streamFilesDir>/stream<streamNum>-%09d.ts -threads auto -acodec libfdk_aac -ar 48000 -ab <ab> -ac 2 -vcodec libx264 -s <size> -aspect 16:9 -vb <vb> -fpre <ffpreset> <streamFilesDir>/stream<streamNum>.m3u8"
    },
    
    //ffmpegで使用する ffpreset ファイルのフルパス index.js と同じ場所にある
    "ffpresetPath" : "/hoge/libx264-hls.ffpreset",
    
    //HLS配信時に作られる一時ファイルを置いておく場所
    "streamFilePath" : "/hoge/streamfiles",
    
    //EPGRec UNA のデータベース(MySQL) にアクセスする設定
    "EpgrecDatabaseCpnfig" : {
        "host": "192.168.xx.xx", //ホストIP
        "user": "epgrec",        //データベースユーザー名
        "password": "epgrec",    //パスワード
        "database": "epgrec",    //データベース名
        "timeout": 5000          //タイムアウト
    },
    
    //EPGRec UNAで設定したテーブル接頭辞
    "EpgrecRecordName" : "Recorder_",
    
    //録画済み一覧で再生する際に使用する動画の拡張子
    //EPGRec UNA でエンコードしたファイルの拡張子を書いてください
    //EPGRec UNA　でエンコードしていない場合は "ts" と書けばスマホの VLC 等で ts ファイルが再生できます
    "RecordedFileExtension" : "mp4",

    //ios の録画済み一覧の URL Scheme の設定　↓の場合だと VLC が起動するようになっている
    "RecordedStreamingiOSURL" : "vlc-x-callback://x-callback-url/stream?url=http://ADDRESS",
    "RecordedDownloadiOSURL" : "vlc-x-callback://x-callback-url/download?url=http://ADDRESS&filename=FILENAME"

````


## 使い方
以下のコマンドで実行されます。

````
node index.js
````

エラーが出て起動しない時は、 config.json、 logConfig.json の設定を見直してみてください。
json ファイルは JSON.parse() でパースしているため、きちんと書かないと動きません。
ログファイルの保存場所や streamFilePath のディレクトリが作成されていないと落ちます。

サービス化については forever 等で各自で行ってください。

##開発環境
* サーバ
 * OS Debian 8.2
 * node.js version v5.2.0

* クライアント
 * iPhone 5s  (iOS 9.2) Mobile Safari
 * iPad mini2 (iOS 9.2) Mobile Safari
 * iPad Air   (iOS 9.2) Mobile Safari
 * iPad Air2  (iOS 9.2) Mobile Safari
 * Xperia Z3 Compact (5.1.1) Chrome (47.0.2526.83)
 * Xperia Z3         (5.1.1) Chrome (47.0.2526.83)

## 今後の拡張予定
* 予約検索と録画済みの一覧をHLSで配信とか対応したいですね
* Firefox, Chrome は HLS に対応していないので Flash のプラグインを追加して対応できそう

## 更新履歴
* version 0.1.0 初版
* version 0.1.1 EPGRec番組表の軽量化 
* version 0.2.0 EPGRec UNA でトランスコード済みのファイルを視聴できるようにした(HSL配信ではありません)
* version 0.2.1 録画予約一覧を追加
* version 0.2.2 2016/02/01以降に番組表一覧が正常に表示出来なくなる問題を修正
* version 0.2.3 自動録画キーワードの管理を追加
* version 0.2.4 番組表での詳細予約を追加、Growl風の通知を追加

## Licence

一応 MIT Licence としておきます。
