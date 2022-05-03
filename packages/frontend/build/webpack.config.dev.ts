const path = require('path')
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { merge } from 'webpack-merge'
import { baseWebpackConfig } from './webpack.config.base'

// development
export const webpackConfig = merge(baseWebpackConfig, {
  mode: 'development',

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, '../../../packages/frontend/public/index.html')
    })
  ],
} as any)
