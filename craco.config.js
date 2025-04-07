// craco.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  webpack: {
    alias: {
      'path': require.resolve('path-browserify'),
      'os': require.resolve('os-browserify/browser'),
      'crypto': require.resolve('crypto-browserify'),
      'buffer': require.resolve("buffer"),
      'stream': require.resolve("stream-browserify"),
      //'process': require.resolve("process/browser") // Удалили process
    },
    plugins: [
      //new webpack.ProvidePlugin({
      //  process: 'process/browser', // Удалили process
      //}),
    ],
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.resolve.fallback = {
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "crypto": require.resolve("crypto-browserify"),
        "buffer": require.resolve("buffer"),
        "stream": require.resolve("stream-browserify"),
      };

      return webpackConfig;
    },
  },
};