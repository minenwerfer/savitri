const path = require('path')
const { merge } = require('webpack-merge')
const { baseWebpackConfig } = require('./webpack.config.base')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// production
const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',

  output: {
    filename: '[name].bundle.js',
    path: `/var/www/html`
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, '../public/index.html')
    })
  ]
})

module.exports = webpackConfig
