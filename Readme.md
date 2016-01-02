EPGRemote
====

EPGRec UNA の HSL View + 番組表簡易 Web UI (Node.js)

## これはなに？

EPGRec UNA 用の後方支援プログラムです。EPGRec UNA の番組情報を使用して HSL(HTTP Live Streaming) でリアルタイムに視聴可能にします。また、簡易的なものですが、スマートフォン用の番組表 Web UI 付属します。簡易予約、自動予約禁止に対応してます。

HLSでのリアルタイム視聴は CPU にとってかなり重たい処理となります。スペックに余裕があるマシンで動かしてください。

ffmpeg の設定については [v42fg3g/TvRemoteViewer_VB](https://github.com/v42fg3g/TvRemoteViewer_VB/) を参考にさせていただきました。作者さんありがとうございます。


Node.js + HTML + CSS + Jquery を書くのはこれが初めてです。温かい目で見守ってください。

## 使用ツール
* Node.js version v5.2.0以降
* ffmpeg なるべく新しい物を使用してください

## インストール方法
* nvm などで Node.js をインストールしてください
* npm で MySQL, log4js, Socket.IO をインストール

````
$ npm install -g forever mysql log4js socketio
```` 

* HLSでリアルタイム視聴を行う場合、ffmpeg と recpt1 等が必要です
* 必須ではありませんが、EPGRec UNA とのチューナーの取り合いを回避するため、BonDriverProxy + recbond のインストールを推奨します。


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
    //Webからアクセスするときに使用するポート番号
    "serverPort" : "8888",
    
    //EPGRec UNAの設定
    "epgrecConfig" : {
        "host" : "192.168.xx.xx:xxxx", //EPGRec UNAが動いてるホストの IP
        "index.php" : "index2.php",     //番組表データ取得のための php ファイルの名前 
        "hourheight" : 180, //EPGRec UNA で設定した1時間あたりの高さ
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
            "command:   : "/hoge/recpt1 --device /dev/pt3video0 --b25 --strip --sid <sid> <channel> - - "
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
    "EpgrecRecoardName" : "Recorder_"

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
* 予約検索と録画済みの一覧 & HLSで配信とか対応したいですね
* Firefox, Chrome は HLS に対応していないので Flash のプラグインを追加して対応できそう

## 更新履歴
* version 0.1 初版

## Licence

一応 MIT Licence としておきます。
