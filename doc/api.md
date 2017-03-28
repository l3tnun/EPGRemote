#REST API

##Base URL
すべての REST API は次の Base URL から始まります。

```
http://{HOSTNAME}:{PORT}/api/
```

リクエストには QueryString を使用する

例

````
http://{HOSTNAME}:{PORT}/api/live/program?types=GR
````

##Response Status Code

| code | 意味                         |
|:-----|-----------------------------|
| 200  |リクエスト成功                 |
| 400  |不正なリクエスト                |
| 404  |Not Found                    |
| 415  |レスポンスフォーマットが正しくない |
| 500  |Server Error                 |

##Resource

###/broadcast

有効な放送波情報

#####URI: ``/broadcast``
#####Formats: json

#####Methods: GET

Parameter: なし

Format

```
[
    "GR", //放送波 GR, BS ,CS, EX
    ....
]
```
---

###/live/program

放送中の番組情報

#####URI: ``/live/program``
#####Formats: json

#####Methods: GET
指定した放送波の番組情報の一覧を表示する

Parameter

|key      |必須 |memo                               |
|:--------|----|-----------------------------------|
|type     |yes |放送波を指定(GR, BS, CS, EX)         |
|time     |no  |指定した x 分後の番組情報を取得         |

Format

```
[
    {
        name:               "ＮＨＫ",                    //局名
        type:               "GR",                       //放送波(GR, BS, CS, EX)
        sid:                "1032",                     //sid
        channel:            "13",                       //channel
        channel_disc":      "GR13_1032",                //channel_disc":
        title:              "title",                    //番組名
        starttime:          "2016-01-01T01:00:00.000Z", //開始時刻
        endtime":           "2016-01-01T01:30:00.000Z", //終了時刻
        description:        "description"               //番組概要
    }, ....
    {
        updateTime:         40000                       //更新時間(ミリ秒)
    }
]
```

---
###/live/config

ライブ視聴に必要な config, 使用可能なものが返される

#####URI: ``/live/config``
#####Formats: json

#####Methods: GET

Parameters

|key    |必須 |memo                                     |
|:------|----|------------------------------------------|
|type   |no  |放送波を指定(GR, BS, CS, EX, recorded)      |
|method |no  |http視聴用(http-live)                      |

Format

```
[
    {
        //type が recorded のときは無い
        tunerList": [
            {
                id:       1,       //チューナー識別id
                name:     "PT3-T0" //チューナー名
                streamId: 1,       //ストリーム番号(該当する streamId がなければ -1)
            }, ....
        ],

        videoConfig": [
            {
                id:    1,                //ビデオ設定識別id
                name:  "1280x1720(main)" //ビデオ設定名
            }, ....
        ]
]
```
---
### /live/config/enable

#####Methods: GET
#####Formats: json

#####Methods: GET

config.json でストリーミング再生が有効になっているかを返す

Format

```
{
    enableLiveStream:     true, //HLS リアルタイム視聴
    enableLiveHttpStream: true, //http リアルタイム視聴
    enableRecordedStream: true  //HLS 録画視聴
}
```
---
###/live/watch

ライブ視聴

#####URI: ``/live/watch``
#####Formats: json
#####Methods: GET 
現在ライブ配信中のストリーム情報を取得

Parameters: なし

Format

```
[
    {
        streamNumber:,        1,                           //ストリーム番号
        viewStatus:           true,                        //再生可能な状態ならtrue
        changeChannelStatus:  true,                        //チャンネル変更が可能ならtrue
        streamType:           "live",                      //HLS リアルタイム視聴なら live, 録画配信なら recorded, http リアルタイム視聴なら http-live
        sid,                  "1032",                      //sid
        channel,              "13",                         //channel
        name:                 "ＮＨＫ",                     //局名
        title:                "title",                    //番組名
        starttime:            "2016-01-01T01:00:00.000Z", //開始時刻
        endtime":             "2016-01-01T01:30:00.000Z", //終了時刻
        description:          "description"               //番組概要
    }, ....
    {
        updateTime:           40000                       //更新時間(ミリ秒)
    }
]
```

#####Methods: GET
指定したストリームの情報を取得

Parameter

|key    |必須 |memo                       |
|:------|----|---------------------------|
|stream |yes |ストリーム番号                |
|time   |no  |指定した x 分後の番組情報を取得 |

Format

```
{
    name:               "ＮＨＫ",                    //局名（録画配信の場合番組名）
    type:               "GR",                       //放送波(GR, BS, CS, EX)
    sid:                "1032",                     //sid
    channel:            "13",                       //channel
    channel_disc":      "GR13_1032",                //channel_disc":
    title:              "title",                    //番組名
    starttime:          "2016-01-01T01:00:00.000Z", //開始時刻
    endtime":           "2016-01-01T01:30:00.000Z", //終了時刻
    description:        "description",              //番組概要
    updateTime:         40000                       //更新時間(ミリ秒)
}
```

#####Methods: POST
HLS でリアルタイム配信を開始

Parameters

|key     |必須 |memo    |
|:-------|----|--------|
|sid     |yes |sid     |
|channel |yes |channel |
|tuner   |yes |tunerId |
|video   |yes |videId  |

Format

```
[
    streamId:,    1, //ストリーム番号    
]
```


#####Methods: POST
録画済み番組を配信を開始

Parameters

|key     |必須 |memo           |
|:-------|----|----------------|
|id    　|yes |id              |
|type    |yes |0: ts, 1: 非 ts |
|video   |yes |videId         |

Format

```
[
    streamId:,    1, //ストリーム番号
]
```

#####Methods: POST
チャンネル変更

Parameters

|key     |必須 |memo     |
|:-------|----|---------|
|stream  |yes |streamId |
|sid     |yes |sid      |
|channel |yes |channel  |
|tunerId |yes |tunerId  |
|videoId |yes |videId   |

#####Methods: DELETE
配信停止

Parameters

|key    |必須 |memo    |
|:------|----|--------|
|stream |yes |sid     |

---
### /live/http/watch

#####Methods: GET

#####Formats: mpegts

http でリアルタイム視聴を開始する

接続が切断されると停止する

Parameter

|key     |必須 |memo    |
|:-------|----|--------|
|sid     |yes |sid     |
|channel |yes |channel |
|tuner   |yes |tunerId |
|video   |yes |videId  |
---
### /live/http/config

#####Methods: GET
#####Formats: json

http でリアルタイム視聴する際に必要な設定を返す

Format

```
{
    //iOS 用設定
    "HttpLiveViewiOSURL": "infuse://x-callback-url/play?url=http://ADDRESS",
    //Android 用設定
    "HttpLiveViewAndroidURL": "intent://ADDRESS#Intent;package=com.mxtech.videoplayer.ad;type=video;scheme=http;end"

}
```


---
###/program

放送中の番組情報

#####URI: ``/program``
#####Formats: json

#####Methods: GET
指定した放送波の番組情報の一覧を表示する

Parameter

|key    |必須 |memo                       |
|:------|----|---------------------------|
|type   |yes |放送波を指定(GR, BS, CS, EX) |
|time   |no  |yyyyMMddHH で指定           |
|length |no  |指定した x 時間分の番組情報を取得 |
|ch     |no  |channel_disc               |

Format

```
{
    genres: [
        {
            id:           15,
            name_jp:      "拡張"
        }, ....
    ],

    time: {
        startTime:        2016010112,
        endTime:        2016010120
    },

    channel: [
        {
            id:               136,
            type              "GR",
            channel:          "16",
            name:             "ＮＨＫ総合２・水戸",
            channel_disc:     "GR16_26625",
            sid:              26625,
        },..
    ],
    
    program: [
        //channel の順に並ぶ
        [
            {
                id: 191402,
                channel_disc: "GR19_1056",
                channel_id: 130,
                type: "GR",
                channel: 19,
                eid: 63309,
                title: "title",
                description: "description",
                category_id: 1,
                sub_genre: 0,
                genre2: 0,
                sub_genre2: 16,
                genre3: 0,
                sub_genre3: 16,
                video_type: 179,
                audio_type: 3,
                multi_type: 0,
                starttime: "2016-05-31 20:54:00",
                endtime: "2016-05-31 21:00:00",
                program_disc: "79fcd43364201e35dcc1fded430b0e01",
                autorec: 1,
                key_id: 0,
                split_time: 0,
                rec_ban_parts: 0,
                recorded: true             //録画予約ありの場合 true なしの場合 false
            }, ....
        ], ...
    ]
}
```

---
###/program/config

放送中の番組情報

#####URI: ``/program/config``
#####Formats: json

#####Methods: GET
番組表表示に必要な config

Parameter: なし

Format

```
{
    recMode: [
        {
            id:       0,
            name:     "Full TS"
        }, ....
    ],
    
    startTranscodeId: 3,

    recModeDefaultId: 3,
    
    programViewConfig: {
        tablet: {
            timeHeight:             180,
            timeWidth:              30,
            timeFontSize:           17,
            stationHeight:          30,
            stationWidth:           140,
            stationFontSize:        15,
            programTitleSize:       10,
            programTimeSize:        10,
            programDescriptionSize: 10
        },
        mobile: {
            timeHeight:             120,
            timeWidth:              20,
            timeFontSize:           12,
            stationHeight:          20,
            stationWidth:           100,
            stationFontSize:        12,
            programTitleSize:       7.5,
            programTimeSize:        7.5,
            programDescriptionSize: 7.5
        }
    }
}
```
---
###/program/autorec

番組の自動予約禁止

#####URI: ``/program/autorec``
#####Formats: json

#####Methods: PUT

Parameter

|key        |必須 |memo                       |
|:----------|----|---------------------------|
|program_id |yes |program id                 |
|autorec    |yes |0:自動予約許可, 1:自動予約禁止 |

Format

エラー時

```
{
    status: "error",            //status
    program_id: 123456,         //program id
    messeage: "error messeage"  //エラーメッセージ
}
```

正常に完了した時

```
{
    status: "completed",       //status
    program_id: 123456,        //program id
    autorec : 1                //autorec
}
```

---
###/program/simplerec

番組の簡易予約

#####URI: ``/program/simplerec``
#####Formats: json

#####Methods: PUT

Parameter

|key        |必須 |memo                       |
|:----------|----|---------------------------|
|program_id |yes |program id                 |

Format

エラー時

```
{
    status: "error",            //status
    program_id: 123456,         //program id
    messeage: "error messeage"  //エラーメッセージ
}
```

リロードが必要なとき

```
{
    status: "reload",          //status
    program_id: 123456         //program id
}
```

正常に完了した時

```
{
    status: "completed",       //status
    program_id: 123456         //program id
}
```

---
###/program/cancelrec

番組予約のキャンセル

#####URI: ``/program/cancelrec``
#####Formats: json

#####Methods: DELETE

Parameter

|key        |必須 |memo                       |
|:----------|----|---------------------------|
|program_id |yes |program id                 |
|autorec    |yes |0:自動予約許可, 1:自動予約禁止 |

Format

エラー時

```
{
    status: "error",            //status
    program_id: 123456,         //program id
    messeage: "error messeage"  //エラーメッセージ
}
```

リロードが必要なとき

```
{
    status: "reload",          //status
    program_id: 123456         //program id
}
```

正常に完了した時

```
{
    status: "completed",       //status
    program_id: 123456         //program id
}
```
---
###/program/customrec

番組の簡易予約

#####URI: ``/program/customrec``
#####Formats: json

#####Methods: PUT

Parameter

|key           |必須 |memo                                   |
|:-------------|----|---------------------------------------|
|syear         |yes |開始 年(number)                         |
|smonth        |yes |開始 月(number)                         |
|sday          |yes |開始 日付(number)                       |
|shour         |yes |開始 時(number)                         |
|smin          |yes |開始 分(number)                         |
|ssec          |yes |開始 秒(number)                         |
|eyear         |yes |終了 年(number)                         |
|emonth        |yes |終了 月(number)                         |
|eday          |yes |終了 日付(number)                       |
|ehour         |yes |終了 時(number)                         |
|emin          |yes |終了 分(number)                         |
|esec          |yes |終了 秒(number)                         |
|category_id   |yes |category_id (number)                   |
|record_mode   |yes |rec mode id (number)                   |
|title         |yes |title (string)                         |
|description   |yes |description(string)                    |
|program_id    |yes |program id(number), idを保持しない場合は0 |
|channel_id    |yes |channel id (number)                    |
|discontinuity |yes |隣接禁止(number) 有効:1, 無効:0           |
|priority      |yes |優先度 (number)                         |
|ts_del        |yes |tsファイル削除(number) 有効:1, 無効:0     |

Format

エラー時

```
{
    status: "error",            //status
    program_id: 123456,         //program id
    messeage: "error messeage"  //エラーメッセージ
}
```

リロードが必要なとき

```
{
    status: "reload",          //status
    program_id: 123456         //program id
}
```

正常に完了した時

```
{
    status: "completed",       //status
    program_id: 123456         //program id
}
```

---
###/recorded

録画済み一覧

#####URI: ``/recorded``
#####Formats: json

#####Methods: GET

Parameter

|key         |必須 |memo                          |
|:-----------|----|------------------------------|
|search      |no  |検索文字列                      |
|keyword_id  |no  |自動予約id                      |
|categoryIid |no  |category id                    |
|channel_id  |no  |channel id                     |
|page        |no  |ページ数 (default 1)            |
|limit       |no  |1ページあたりの表示量(default 24) |

Format


```
{

    programs: [
        {
            id: 111,                                 //録画済み番組id
            thumbs: "/thumbs/hoge.ts.jpg",           //サムネイルパス
            title: "title",                          //番組タイトル
            starttime: "2016-01-01T01:00:00.000Z",   //開始時間
            endtime: "2016-01-01T01:00:00.000Z",     //終了時間
            channel_name: "channel name",            //チャンネル名
            description: "description"               //番組詳細
            "keyword_id": 0                          //キーワードid 0のときはキーワードid なし
        }, ....
    ],
    totalNum: 10,                                   //全番組数
    limit : 24                                      //1ページあたりの表示量
}
```

---
###/recorded/keyword

録画済み一覧のキーワード一覧

#####URI: ``/recorded/keyword``
#####Formats: json

#####Methods: GET

Parameter

|key         |必須 |memo                          |
|:-----------|----|------------------------------|
|search      |no  |検索文字列                      |
|keyword_id  |no  |自動予約id                      |
|category_id |no  |category id                    |
|channel_id  |no  |channel id                     |

Format


```
[
    {
        id: 111,              //autorec id
        name: "keyword name", //キーワード名
        count: 10             //カウント
    }, ....
]
```

---
###/recorded/category

録画済み一覧のカテゴリ一覧

#####URI: ``/recorded/category``
#####Formats: json

#####Methods: GET

Parameter

|key         |必須 |memo                          |
|:-----------|----|------------------------------|
|search      |no  |検索文字列                      |
|keyword_id  |no  |自動予約id                      |
|category_id |no  |category id                    |
|channel_id  |no  |channel id                     |

Format


```
[
    {
        id: 111,               //category id
        name: "category name", //カテゴリ名
        count: 10              //カウント
    }, ....
]
```

---
###/recorded/channel

録画済み一覧のチャンネル一覧

#####URI: ``/recorded/channel``
#####Formats: json

#####Methods: GET

Parameter

|key         |必須 |memo                          |
|:-----------|----|------------------------------|
|search      |no  |検索文字列                      |
|keyword_id  |no  |自動予約id                      |
|category_id |no  |category id                    |
|channel_id  |no  |channel id                     |

Format


```
[
    {
        id: 111,               //channel id
        name: "category name", //チャンネル名
        count: 10              //カウント
    }, ....
]
```

---
###/recorded/video

指定した rec_id の番組のリンクを取得

#####URI: ``/recorded/video``
#####Formats: json

#####Methods: GET

Parameter

|key      |必須 |memo   |
|:--------|----|-------|
|rec_id   |yes |rec id |

Format


```
[
    {
        type: 1,                //0: ts, 1: トランスコード済み
        id: 1111,               //type = 0 の場合 reserveTbl, type = 1 の場合 transcodeTbl の id
        name: "H264-HD",        //name
        status: 2,              //チャンネル名 0:変換待ち, 1:変換中, 2: 変換完了, 3:変換失敗
        path: "/video/hoge.mp4" //video url
    }, ....
]
```

---
###/recorded/video

指定した rec_id の video を削除

#####URI: ``/recorded/video``
#####Formats: json

#####Methods: DELETE

Parameter

|key         |必須 |memo                          |
|:-----------|----|-------------------------------|
|rec_id      |yes |rec id                         |
|delete_file |yes |0:ファイル削除しない 1:ファイル削除 |

Format

エラー時

```
{
    status: "error",            //status
    rec_id: 123456,             //program id
    messeage: "error messeage"  //エラーメッセージ
}
```

正常に完了した時

```
{
    status: "completed",  //status
    rec_id: 123456        //rec id
}
```

---
###/reservation

予約一覧

#####URI: ``/reservation``
#####Formats: json

#####Methods: GET

Parameter

|key      |必須 |memo                          |
|:--------|----|------------------------------|
|page     |no  |ページ数 (default 1)            |
|limit    |no  |1ページあたりの表示量(default 24) |

Format


```
{

    programs: [
        {
            id: 111,                                 //番組予約id
            program_id: 1111                         //番組id
            title: "title",                          //番組タイトル
            starttime: "2016-01-01T01:00:00.000Z",   //開始時間
            endtime: "2016-01-01T01:00:00.000Z",     //終了時間
            channel_name: "channel name",            //チャンネル名
            description: "description",              //番組詳細
            type: "GR",                              //放送波種類
            autorec: 0,                              //keyword id 0以外ならキーワード予約
            mode: "H264-HD"                          //録画モード
        }, ....
    ],
    totalNum: 18,                                   //全番組数
    limit : 24                                      //1ページあたりの表示量
}
```
---
###/reservation

指定した rec_id の 予約を削除

#####URI: ``/reservation ``
#####Formats: json

#####Methods: DELETE

Parameter

|key         |必須 |memo                      |
|:-----------|----|--------------------------|
|rec_id      |yes |rec id                    |
|autorec     |yes |0:自動予約許可 1:自動予約禁止 |

Format

エラー時

```
{
    status: "error",            //status
    rec_id: 123456,             //program id
    messeage: "error messeage"  //エラーメッセージ
}
```

正常に完了した時

```
{
    status: "completed",  //status
    rec_id: 123456        //rec id
}
```

---
###/keyword

自動録画キーワードの一覧

#####URI: ``/keyword``
#####Formats: json

#####Methods: GET

Parameter

|key      |必須 |memo                          |
|:--------|----|------------------------------|
|page     |no  |ページ数 (default 1)            |
|limit    |no  |1ページあたりの表示量(default 24) |

Format


```
{

    keywords: [
        {
            id: 117,                                    //keyword id
            keyword: "keyword",                         //keyword
            use_regexp: false,                          //正規表現
            collate_ci: true,                           //全角半角同一視
            ena_title: true,                            //タイトル
            ena_desc: true,                             //概要
            overlap: false,                             //多重予約
            rest_alert: false,                          //無該当警告
            criterion_dura: false,                      //時間量変動警告
            discontinuity: false,                       //隣接禁止
            split_time: 0,                              //分割時間(秒)
            kw_enable: true,                            //キーワード有効
            channel_name: "チャンネル名",                 //channel name
            channel_id: 135,                            //channel id
            category_name: "カテゴリー名",                //category name
            category_id: 9,                             //category id
            subGenre: "サブジャンル名",                   //サブジャンル名
            subGenre_id: 11                             //サブジャンル id
            typeGR: true,                               //GR
            typeBS: false,                              //BS
            typeCS: false,                              //CS
            typeEX: false,                              //EX
            weekofdays: {                               //曜日
                0: true,                                //月
                1: true,                                //火
                2: true,                                //水
                3: true,                                //木
                4: true,                                //金
                5: true,                                //土
                6: true                                 //日
            },
            startTime: 24,                              //開始時刻( 24の場合、開始時刻は無し )
            periodTime: 1,                              //開始時刻からの幅時間
            priority: 10,                               //優先度
            sft_start: 0,                               //開始時刻シフト(秒)
            sft_end: 0,                                 //終了時刻シフト(秒)
            autorec_mode_name: "H264-HD",               //録画モード名前
            autorec_mode: 3,                            //録画モード id
            recordedNum: 1,                             //録画番組数
            firstGenre: true,                           //ジャンル全保持
            directory: "deirectory",                    //保存ディレクトリ名
            filenameFormat: "filename format"           //ファイル名フォーマット
        }, ....
    ],
    totalNum: 18,                                   //全キーワード数
    limit : 24                                      //1ページあたりの表示量
}
```

---
###/keyword

指定した keyword id の自動録画キーワードを取得

#####URI: ``/keyword``
#####Formats: json

#####Methods: GET

Parameter

|key        |必須 |memo       |
|:----------|----|-----------|
|keyword_id |yes |keyword id |

Format


```
{

    keywords: {
        id: 117,                                    //keyword id
        keyword: "keyword",                         //keyword
        use_regexp: false,                          //正規表現
        collate_ci: true,                           //全角半角同一視
        ena_title: true,                            //タイトル
        ena_desc: true,                             //概要
        overlap: false,                             //多重予約
        rest_alert: false,                          //無該当警告
        criterion_dura: false,                      //時間量変動警告
        discontinuity: false,                       //隣接禁止
        split_time: 0,                              //分割時間(秒)
        kw_enable: true,                            //キーワード有効
        channel_name: "チャンネル名",                 //channel name
        channel_id: 135,                            //channel id
        category_name: "カテゴリー名",                //category name
        category_id: 9,                             //category id
        subGenre: "サブジャンル名",                   //サブジャンル名
        subGenre_id: 11                             //サブジャンル id
        typeGR: true,                               //GR
        typeBS: false,                              //BS
        typeCS: false,                              //CS
        typeEX: false,                              //EX
        weekofdays: {                               //曜日
            0: true,                                //月
            1: true,                                //火
            2: true,                                //水
            3: true,                                //木
            4: true,                                //金
            5: true,                                //土
            6: true                                 //日
        },
        startTime: 24,                              //開始時刻( 24の場合、開始時刻は無し )
        periodTime: 1,                              //開始時刻からの幅時間
        priority: 10,                               //優先度
        sft_start: 0,                               //開始時刻シフト(秒)
        sft_end: 0,                                 //終了時刻シフト(秒)
        autorec_mode_name: "H264-HD",               //録画モード名前
        autorec_mode: 3,                            //録画モード id
        recordedNum: 1,                             //録画番組数
        firstGenre: true,                           //ジャンル全保持
        directory: "deirectory",                    //保存ディレクトリ名
        filenameFormat: "filename format",          //ファイル名フォーマット
        transConfig": [
            {
                "mode": 3,                          //トランスコードモード0
                "dir": "trans dir0"                 //保存ディレクトリ0
            },
            {
                "mode": 0,                          //トランスコードモード1
                "dir": "trans dir1"                 //保存ディレクトリ1
            },
            {
                "mode": 0,                          //トランスコードモード2
                "dir": "trans dir2"                 //保存ディレクトリ2
            }
        ],
        "ts_del": 1
    }
}
```

---
###/keyword

指定した keyword_id の 自動キーワードを削除

#####URI: ``/keyword ``
#####Formats: json

#####Methods: DELETE

Parameter

|key         |必須 |memo       |
|:-----------|----|-----------|
|keyword_id  |yes |keyword id |

Format

エラー時

```
{
    status:     "error",          //status
    keyword_id: 123456,           //keyword id
    messeage:   "error messeage"  //エラーメッセージ
}
```

正常に完了した時

```
{
    status: "completed",  //status
    keyword_id: 123456    //keyword id
}
```

---
###/keyword

指定した keyword_id の 自動キーワードを有効化、無効化

#####URI: ``/keyword ``
#####Formats: json

#####Methods: PUT

Parameter

|key         |必須 |memo              |
|:-----------|----|------------------|
|keyword_id  |yes |keyword id        |
|status      |yes |1: 有効化, 2: 無効化 |
Format

エラー時

```
{
    status:     "error",          //status
    keyword_id: 123456,           //keyword id
}
```

正常に完了した時

```
{
    status: "completed",  //status
    keyword_id: 123456    //keyword id
    enable:     true      // ture: 有効, false: 無効
}
```

エラー発生時
epgrec UNA からエラー情報が取得できないのでエラーメッセージはない

---
###/keyword

指定した 自動キーワードを追加

#####URI: ``/keyword ``
#####Formats: json

#####Methods: POST

Parameter

|key             |必須 |memo                                      |
|:---------------|----|------------------------------------------|
|keyword_id      |no  | keyword id                               |
|keyword         |yes | 検索キーワード                             |
|use_regexp      |yes | 正規表現 1:有効, 0: 無効                   |
|collate_ci      |yes | 全角半角同一視 1:有効, 0: 無効              |
|ena_title       |yes | タイトル有効化 1:有効, 0: 無効              |
|ena_desc        |yes | 概要有効化 1:有効, 0: 無効                 |
|typeGR          |yes | GR 1:有効, 0: 無効                       |
|typeBS          |yes | BS 1:有効, 0: 無効                       |
|typeCS          |yes | CS 1:有効, 0: 無効                       |
|typeEX          |yes | EX 1:有効, 0: 無効                       |
|channel_id      |yes | channel id                              |
|category_id     |yes | category id                             |
|sub_genre       |yes | sub genre id                            |
|first_genre     |yes | 全保持 1:有効, 0: 無効                    |
|prgtime         |yes | 開始時刻 0 ~ 24 ( 24の場合、開始時刻は無し ) |
|period          |yes | 開始時刻からの時間幅 1~23                  |
|week0           |yes | 月曜 1:有効, 0: 無効                      |
|week1           |yes | 火曜 1:有効, 0: 無効                      |
|week2           |yes | 水曜 1:有効, 0: 無効                      |
|week3           |yes | 木曜 1:有効, 0: 無効                      |
|week4           |yes | 金曜 1:有効, 0: 無効                      |
|week5           |yes | 土曜 1:有効, 0: 無効                      |
|week6           |yes | 日曜 1:有効, 0: 無効                      |
|kw_enable       |yes | 自動予約 1:有効, 0: 無効                   |
|overlap         |yes | 多重予約許可 1:有効, 0: 無効                |
|rest_alert      |yes | 無該当警告 1:有効, 0: 無効                 |
|criterion_dura  |yes | 時間量変動警告 1:有効, 0: 無効              |
|discontinuity   |yes | 隣接禁止 1:有効, 0: 無効                   |
|sft_start       |yes | 時刻シフト開始(分)                         |
|sft_end         |yes | 時刻シフト終了(分)                         |
|split_time      |yes | 分割時間(分)                              |
|priority        |yes | 優先度                                    |
|autorec_mode    |yes | 録画モード                                 |
|directory       |yes | 保存ディレクトリ                            |
|filename_format |yes | ファイル名フォーマット                       |
|trans_mode0     |yes | トランスコードモード1                        |
|transdir0       |yes | トランスコード保存ディレクトリ1                |
|trans_mode1     |yes | トランスコードモード2                        |
|transdir1       |yes | トランスコード保存ディレクトリ2                |
|trans_mode2     |yes | トランスコードモード3                        |
|transdir2       |yes | トランスコード保存ディレクトリ3                |
|ts_del          |yes | 元のファイル自動削除                         |

Format

エラー時

```
{
    status:     "error",          //status
}
```

正常に完了した時

```
{
    status: "completed",  //status
}
```

エラー発生時
epgrec UNA からエラー情報が取得できないのでエラーメッセージはない

---
###/search

検索結果

#####URI: ``/search``
#####Formats: json

#####Methods: POST

Parameter

|key         |memo               |
|:-----------|-------------------|
|search      |検索ワード         |
|use_regexp  |1: 有効化, 0: 無効化 |
|collate_ci  |1: 有効化, 0: 無効化 |
|ena_title   |1: 有効化, 0: 無効化 |
|ena_desc    |1: 有効化, 0: 無効化 |
|typeGR      |1: 有効化, 0: 無効化 |
|typeBS      |1: 有効化, 0: 無効化 |
|typeCS      |1: 有効化, 0: 無効化 |
|typeEX      |1: 有効化, 0: 無効化 |
|first_genre |1: 有効化, 0: 無効化 |
|period      |1 ~ 23             |
|week0       |1: 有効化, 0: 無効化 |
|week1       |1: 有効化, 0: 無効化 |
|week2       |1: 有効化, 0: 無効化 |
|week3       |1: 有効化, 0: 無効化 |
|week4       |1: 有効化, 0: 無効化 |
|week5       |1: 有効化, 0: 無効化 |
|week6       |1: 有効化, 0: 無効化 |
|channel_id  |channel id         |
|category_id |category id        |
|sub_genre   |sub genre id       |
|prgtime     |0 ~ 23             |

※オプションの指定項目は epgrec UNA の programTable.php に準じています。詳しくはそちらの実装を読んでください。おそらく以下のようにオプションを指定すれば問題ないはずです。

* search が空の場合
 * use\_regexp, collate\_ci, ena\_title, ena\_desc はすべて disable でなければならない
* use\_regexp, collate\_ci, ena\_title, ena\_desc がいずれも disable で search が空でないの場合
 * ena\_title と ena\_desc は有効化しなければならない
* week0 ~ 6 がいずれも空の場合
 * week0 ~ 6 をすべて有効化しなければならない
* channel\_id が有効な場合
 * channel\_id の type(放送波) に合わせて typeGR, typeBS, typeCS, typeEX の値を設定しなければならない
* channel\_id が有効でなく、typeGR, typeBS, typeCS, typeEX がすべて disable である場合
 * epgrec UNA で有効化されている放送波に応じて値を設定しなければならない

Format

エラー時

```
{
    status:     "error"          //status
}
```

正常に完了した時

```
{
    status": "completed",
    program": [
        {
            id: 1111,                                     //program id
            channel_name: "channe name",                  //channel name
            channel_id: 111,                              //channel_id
            title: "title",                               //title
            description: "description",                   //description
            category_id: 11,　　　　　　　　　　　　　　　　　　//category id
            sub_genre: 11,                                //sub　genre
            starttime: "2016-01-01T01:00:00.000Z",        //開始時刻
            endtime: "2016-01-01T01:30:00.000Z",          //終了時刻
            autorec: 1,                                   //0:自動予約禁止状態, 1: 自動予約許可状態
            recorded: false                               //true: 予約されている, false: 予約されていない
        }, ...
    ]
}
```

---
###/search/config

検索に必要なオプションを取得

#####URI: ``/search/config``
#####Formats: json

#####Methods: GET

Parameter: なし

Format

```
{

    genres: [
        {
            id: 1,
            name_jp: "ニュース・報道"
        }, ...
    ],
    channel": [
        {
            id: 117,
            type: "GR",
            channel: "13",
            name: "ＮＨＫＥテレ１東京",
            channel_disc: "GR13_1032",
            sid: "1032",
            skip: 0
        }, ...
    ],
    subGenre: {
        0: { //genre_id 0
            16: "すべて"
        },
        1: { //genre_id 1
            0: "定時・総合",
            1: "天気",
            2: "特集・ドキュメント",
            3: "政治・国会",
            4: "経済・市況",
            5: "海外・国際",
            6: "解説",
            7: "討論・会談",
            8: "報道特番",
            9: "ローカル・地域",
            10: "交通",
            15: "その他",
            16: "すべて"

        }, ...
    },
    recMode: [
        {
            id: "0",
            name: "Full TS"
        }, ....
    ],
    startTranscodeId: "3",
    recModeDefaultId: "3",
    broadcast: {
        GR: true,
        BS: true,
        CS: true,
        EX: true
    }
}
```

---
###/log

epgrec UNA の log を取得

#####URI: ``/log ``
#####Formats: json

#####Methods: GET

Parameter

|key     |必須 |memo                 |
|:-------|----|---------------------|
|info    |no  |情報 1: 有効, 0:無効   |
|warning |no  |警告 1: 有効, 0:無効   |
|error   |no  |エラー 1: 有効, 0:無効 |
|debug   |no  |DEBUG 1: 有効, 0:無効 |

Format


```
[
    {
        id: 111,                                          //id
        logtime: "2016-01-01T01:00:00.000Z",              //時刻
        level: 0,                                         //ログレベル 0:情報, 1:警告, 2:エラー, 3:DEBUG
        message: "message",                               //メッセージ
        link: {                                           //メッセージに含まれるリンク 空の場合もある
            search: "keyword_id=1",                       //番組検索のオプション
            program: "type=GR&length=18&time=2016010420", //番組表のオプション
            recorded: "keyword_id=1"                      //録画済み一覧のオプション
        }
    }, ....
]
```

---
###/epg

EPG 単局更新

#####URI: ``/epg ``
#####Formats: json

#####Methods: GET

Parameter

|key          |必須 |memo         |
|:------------|----|-------------|
|channel_disc |yes |channel disc |

Format

エラー時

```
{
    status:        "error",         //status
    channel_disc": "channel_disc"", //channel disc
    messeage:      "error messeage" //エラーメッセージ
}
```

正常に完了した時

```
{
    status:        "completed",   //status
    channel_disc": "channel_disc" //channel disc"
}
```

---
###/disk

ディスク空き容量

#####URI: ``/disk ``
#####Formats: json

#####Methods: GET

Parameter: なし

Format

````
{
    size: 500,       //ディスク容量(GB)
    used: 200,       //ディスク使用量(GB)
    available: 300   //ディスク使用可能容量(GB)
}
````
