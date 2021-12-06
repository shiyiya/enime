const path = require('path');
const zlib = require("zlib");
const Dotenv = require('dotenv-webpack');
const CompressionPlugin = require('compression-webpack-plugin');

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
                        hotReload: false
                    }
                }
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
