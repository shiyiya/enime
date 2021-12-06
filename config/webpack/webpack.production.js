const path = require('path');
const zlib = require("zlib");
const Dotenv = require('dotenv-webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { sass } = require('svelte-preprocess-sass');

module.exports = {
    mode: 'production',
    plugins: [
        new Dotenv({
            path: path.resolve(__dirname, '../..', './.env.production'),
        }),
        new CompressionPlugin({
            filename: "[path][base].br",
            algorithm: "brotliCompress",
            test: /\.(js|css|html|svg)$/,
            compressionOptions: {
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                },
            },
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        compilerOptions: {
                            dev: false
                        },
                        emitCss: false,
                        hotReload: false,
                        preprocess: {
                            style: sass(),
                        }
                    }
                }
            },
            {
                test: /\.css$/,
                enforce: 'pre',
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [require('autoprefixer')]
                        }
                    },
                    'sass-loader'
                ]
            },
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '../..', './public'),
        },
        port: process.env.PORT
    },
    devtool: 'source-map',
};
