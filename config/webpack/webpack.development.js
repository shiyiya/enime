const path = require('path');
const Dotenv = require('dotenv-webpack');

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
                        hotReload: true
                    }
                }
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
