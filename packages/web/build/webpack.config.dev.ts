import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import merge from './merge'
import baseWebpackConfig from './webpack.config.base'

// development
export default (appDir: string) => merge(baseWebpackConfig(appDir), {
  mode: 'development',
  entry: [
    'webpack/hot/dev-server.js',
    'webpack-dev-server/client/index.js?hot=true&live-reload=true',
    appDir,
  ],
  plugins: [
    new HtmlWebpackPlugin({
      base: '/',
      inject: 'body',
      template: '../static/index.ejs'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],

})
