/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import LodashModuleReplacementPlugin from "lodash-webpack-plugin";
import { dependencies as externals } from '../../src/package.json';

export default {
  externals: [...Object.keys(externals || {})],

  module: {
    rules: [
      {
        test: /\.[jt]s?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          },
        },
      },
    ],
  },

  experiments: { topLevelAwait: true },

  output: {
    path: path.join(__dirname, '../../src'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [path.join(__dirname, '../src'), 'node_modules'],
  },

  plugins: [
    new LodashModuleReplacementPlugin,
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};
