const copyConfig = require("./copy.config");

const loaders = require("./loaders");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    cache : true,
    entry: {main: ['./src/index.ts'], vendor: ['angular', './src/vendors.ts'], },
    output: {
        filename: 'app.bundle.js',
        path: 'dist_dev',
        chunkFilename: '[id].chunk.js',
    },
    devtool: 'cheap-module-source-map',
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js', '.json']
    },
    resolveLoader: {
        modulesDirectories: ["node_modules"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
            hash: true
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 8080,
            server: {
                baseDir: 'dist_dev'
            },
            ui: false,
            online: false,
            notify: false
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.jquery': 'jquery'
        }),
        new ExtractTextPlugin("[name].styles.css"),
        copyConfig,
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
        new webpack.optimize.OccurenceOrderPlugin(),
    ],
    module:{
        loaders: loaders,
        preLoaders: [
            {
                test: /\.ts$/,
                loader: "tslint"
            }
        ]
    }
};