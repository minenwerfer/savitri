const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const { baseWebpackConfig } = require('./webpack.config.base')

// development
const webpackConfig = merge(baseWebpackConfig, {
  mode: 'development',

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, '../public/index.html')
    })
  ]
})

module.exports = webpackConfig
