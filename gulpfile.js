"use strict";

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const del = require('del');
const plumber = require('gulp-plumber');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const mocha = require('gulp-mocha');
const gutil = require('gulp-util');
const minimist = require('minimist');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');

const config = {
    server : {
        src: [
            './src_server/**/*.ts'
        ],
        dst: './build-server',
        options: {
            module: 'commonjs',
            target: 'ES6',
            strictNullChecks: true,
            noImplicitAny: true,
            noImplicitReturns: true,
            noImplicitThis: true,
            noUnusedParameters: true,
            noUnusedLocals: true,
            noFallthroughCasesInSwitch: true,
            suppressImplicitAnyIndexErrors: true
        }
    },
    client : {
        src: [
            './src_client/**/*.ts'
        ],
        dst : './build-client',
        css: {
            src: [
                './css/**/*.sass'
            ],
            dst: './build-css'
        }
    }
};

let webpackConfig = {
    output: {
        filename: 'app.js'
    },

    resolve: {
        extensions: ['', '.ts', '.webpack.js', '.web.js', '.js']
    },

    cache: true,

    externals: {
        "mithril": "m",
        "socket.io-client": "io",
        "chart.js": "Chart"
    },

    module: {
        exclude: './src_client/extendedTypings',
        loaders: [ { test: /\.ts$/, loader: 'ts-loader' } ]
    }
}

/**
* 引数
* NODE_ENVに指定がなければ開発モードをデフォルトにする
*/
const knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'development' }
};

const options = minimist(process.argv.slice(2), knownOptions);
const isProduction = (options.env === 'production') ? true : false;

if(isProduction) {
    //本番
    //app.js の圧縮
    webpackConfig["plugins"] = [
        new webpack.optimize.OccurenceOrderPlugin(true),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({ output: { comments: false } })
    ];
} else {
    //開発
    //source-map の有効化
    webpackConfig["devtool"] = "#source-map";
}

gulp.task('clean-server', () => {
    return del([config.server.dst]);
})

gulp.task('build-server', ['clean-server'],() => {
    return gulp.src(config.server.src)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(typescript(config.server.options))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.server.dst));
});

gulp.task('test-server', ['build-server'], () => {
    return gulp.src([config.server.dst + '/test/**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list'}))
        .on('error', gutil.log);
});

gulp.task('clean-client', () => {
    return del([config.client.dst]);
})

gulp.task('build-client', ['clean-client'], () => {
    return gulp.src(config.client.src)
        .pipe(plumber())
        .pipe(webpackStream(webpackConfig))
        .pipe(gulp.dest(config.client.dst))
        .on('error', (error) => {
            console.error(error);
        });
});

gulp.task('clean-client-css', () => {
    return del([config.client.css.dst]);
})

gulp.task('client-css-build', () => {
    let result = gulp.src(config.client.css.src)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('style.css'))

    if(isProduction) {
        return result
            .pipe(cleanCSS())
            .pipe(gulp.dest(config.client.css.dst));
    } else {
        return result
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(config.client.css.dst));
    }
});

//clean
gulp.task('clean', ['clean-server', 'clean-client', 'clean-client-css']);

//build
gulp.task('build', ['clean', 'build-server', 'build-client', 'client-css-build']);

//test
gulp.task('test', ['test-server']);

gulp.task('watch', [
        'clean-server',
        'build-server',
        'test-server',
        'clean-client',
        'build-client',
        'clean-client-css',
        'client-css-build'
    ], () => {
    gulp.watch(config.server.src, ['clean-server', 'build-server', 'test-server']);
    gulp.watch(config.client.src, ['clean-client', 'build-client']);
    gulp.watch(config.client.css.src, ['clean-client-css', 'client-css-build']);
});

gulp.task('default', ['watch']);

