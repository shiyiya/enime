const path = require('path');
const Dotenv = require('dotenv-webpack');
const { sass } = require('svelte-preprocess-sass');
require('dotenv').config({ path: '../.env.development' });

module.exports = {
    mode: 'development',
    plugins: [
        new Dotenv({
            path: path.resolve(__dirname, '../..', './.env.development'),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        compilerOptions: {
                            dev: true
                        },
                        emitCss: false,
                        hotReload: true,
                        preprocess: {
                            style: sass(),
                        }
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
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
        hot: true,
        static: {
            directory: path.join(__dirname, '../..', './public'),
        },
        compress: true,
        port: process.env.PORT,
    },
    devtool: 'eval-source-map',
};
