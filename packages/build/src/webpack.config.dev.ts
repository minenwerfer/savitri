import webpack from 'webpack'
import type { BuildParams } from './types'
import merge from './merge'
import makeHtmlWebpackPlugin from './htmlWebpackPlugin'
import makeCopyWebpackPlugin from './copyWebpackPlugin'
import baseWebpackConfig from './webpack.config.base'

// development
export default (params: BuildParams) => merge(baseWebpackConfig(params), {
  mode: 'development',
  entry: [
    'webpack/hot/dev-server.js',
    'webpack-dev-server/client/index.js?hot=true&live-reload=true',
    params.appDir,
  ],
  plugins: [
    makeHtmlWebpackPlugin(params.instanceConfig),
    makeCopyWebpackPlugin(params.appDir),
    new webpack.HotModuleReplacementPlugin()
  ],
})
