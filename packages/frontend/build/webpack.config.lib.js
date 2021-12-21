const path = require('path')
const { merge } = require('webpack-merge')
const { baseWebpackConfig } = require('./webpack.config.base')

// library
const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../../../dist'),
    filename: '[name].min.js',
    library: '[name]',
    libraryTarget: 'umd'
  },
  optimization: {
    splitChunks: false
  }
})

module.exports = webpackConfig
