const path = require('path');
const Dotenv = require('dotenv-webpack');
const BrotliPlugin = require('brotli-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { sass } = require('svelte-preprocess-sass');

module.exports = {
    mode: 'production',
    plugins: [
        new Dotenv({
            path: path.resolve(__dirname, '../..', './.env.production'),
        }),
        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
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
