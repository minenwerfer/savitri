const path = require('path')
const { merge } = require('webpack-merge')
const { baseWebpackConfig } = require('./webpack.config.base')

// library
const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  entry: {
    components: path.resolve(__dirname, '../src/components/index.ts'),
  },
  output: {
    path: path.resolve(__dirname, '../../../dist/frontend'),
    filename: '[name].js',
  },
  optimization: {
    splitChunks: false
  }
})

module.exports = webpackConfig
