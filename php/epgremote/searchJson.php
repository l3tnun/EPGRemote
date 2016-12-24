<?php
include_once('../config.php');
include_once( INSTALL_PATH . '/Keyword.class.php' );

$search      = '';
$use_regexp  = 0;
$collate_ci  = FALSE;
$ena_title   = FALSE;
$ena_desc    = FALSE;
$typeGR      = FALSE;
$typeBS      = FALSE;
$typeCS      = FALSE;
$typeEX      = FALSE;
$category_id = 0;
$channel_id  = 0;
$weekofday   = 0;
$prgtime     = 24;
$period      = 1;
$sub_genre   = 16;
$first_genre = 1;

//query処理
if( isset($_POST['search']) ) {
    $search = trim($_POST['search']);
    if( $search != '' ) {
        $use_regexp = isset($_POST['use_regexp']);
        if( !$use_regexp ) {
            $collate_ci = isset($_POST['collate_ci']);
        }
        $ena_title  = isset($_POST['ena_title']);
        $ena_desc   = isset($_POST['ena_desc']);
    }
}

if( isset($_POST['channel_id']) ) { $channel_id = (int)($_POST['channel_id']); }

if( isset($_POST['typeGR']) ) { $typeGR = isset($_POST['typeGR']); }
if( isset($_POST['typeBS']) ) { $typeBS = isset($_POST['typeBS']); }
if( isset($_POST['typeCS']) ) { $typeCS = isset($_POST['typeCS']); }
if( isset($_POST['typeEX']) ) { $typeEX = isset($_POST['typeEX']); }

if( isset($_POST['category_id']) ) {
    $category_id = (int)($_POST['category_id']);
    $first_genre = !isset($_POST['first_genre']);
    if( isset($_POST['sub_genre']) ) { $sub_genre = (int)($_POST['sub_genre']); }
}

if( isset($_POST['week0']) ) { $weekofday += 0x1; }
if( isset($_POST['week1']) ) { $weekofday += 0x2; }
if( isset($_POST['week2']) ) { $weekofday += 0x4; }
if( isset($_POST['week3']) ) { $weekofday += 0x8; }
if( isset($_POST['week4']) ) { $weekofday += 0x10; }
if( isset($_POST['week5']) ) { $weekofday += 0x20; }
if( isset($_POST['week6']) ) { $weekofday += 0x40; }

if( isset($_POST['prgtime']) ) { $prgtime = (int)($_POST['prgtime']); }
if( isset($_POST['period']) )  { $period  = (int)($_POST['period']);  }

try {
    DBRecord::createRecords( CHANNEL_TBL, 'WHERE type=\'GR\' AND skip=0 ORDER BY id' );
    DBRecord::createRecords( CHANNEL_TBL, 'WHERE type=\'BS\' AND skip=0 ORDER BY id' );
    DBRecord::createRecords( CHANNEL_TBL, 'WHERE type=\'CS\' AND skip=0 ORDER BY id' );
    DBRecord::createRecords( CHANNEL_TBL, 'WHERE type=\'EX\' AND skip=0 ORDER BY id' );
    $precs = Keyword::search( $search, $use_regexp, $collate_ci, $ena_title, $ena_desc, $typeGR, $typeBS, $typeCS, $typeEX, $category_id, $channel_id, $weekofday, $prgtime, $period, $sub_genre, $first_genre );

    $programs = array();
    foreach( $precs as $key => $p) {
        $program = array();
        $program['id'] = $p->id;
        $program['channel_id'] = $p->channel_id;
        $program['type'] = $p->type;
        $program['channel'] = $p->channel;
        $program['eid'] = $p->eid;
        $program['title'] = $p->title;
        $program['description'] = $p->description;
        $program['category_id'] = $p->category_id;
        $program['sub_genre'] = $p->sub_genre;
        $program['genre2'] = $p->genre2;
        $program['sub_genre2'] = $p->sub_genre2;
        $program['genre3'] = $p->genre3;
        $program['sub_genre3'] = $p->sub_genre3;
        $program['video_type'] = $p->video_type;
        $program['audio_type'] = $p->audio_type;
        $program['multi_type'] = $p->multi_type;
        $program['starttime'] = $p->starttime;
        $program['endtime'] = $p->endtime;
        $program['program_disc'] = $p->program_disc;
        $program['autorec'] = $p->autorec;
        $program['key_id'] = $p->key_id;
        $program['split_time'] = $p->split_time;
        $program['rec_ban_parts'] = $p->rec_ban_parts;

        array_push($programs, $program);
    }

    print_r ( json_encode($programs) );
} catch( exception $e ) {
    exit( $e->getMessage() );
}
?>

