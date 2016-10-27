'use strict';

var webpackConfig = require('./webpack/webpack.test.js');
require('phantomjs-polyfill')
webpackConfig.entry = {};

let files = ['./node_modules/phantomjs-polyfill/bind-polyfill.js',];
let env = process.argv.find(el => /^--NODE_ENV=/.test(el));


files.push('./stf-select.directive.spec.ts');

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: env === '--NODE_ENV=test' ? false : true,
        browsers: [env === '--NODE_ENV=test' ? 'PhantomJS': 'PhantomJS' /*"Chrome"*/],
        singleRun: env === '--NODE_ENV=test' ? true : false,
        autoWatchBatchDelay: 300,
        files: files,
        babelPreprocessor: {
            options: {
                presets: ['es2015']
            }
        },
        preprocessors: {
            '**/*.ts': ['webpack'],
            'src/**/!(*.spec)+(.js)': ['coverage'],
            //'src/**/!(*.spec)+(.ts)': ['coverage'],
        },
        webpackMiddleware: {
            stats: {
                chunkModules: false,
                colors: true
            }
        },
        webpack: webpackConfig,
        reporters: [
            'dots',
            'spec',
            'coverage'
        ],
        coverageReporter: {
            reporters: [
                {
                    dir: 'reports/coverage/',
                    subdir: '.',
                    type: 'html'
                },{
                    dir: 'reports/coverage/',
                    subdir: '.',
                    type: 'cobertura'
                }, {
                    dir: 'reports/coverage/',
                    subdir: '.',
                    type: 'json'
                }
            ]
        }
    });
};