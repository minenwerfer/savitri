import merge from './merge'
import type { BuildParams } from './types'
import makeHtmlWebpackPlugin from './htmlWebpackPlugin'
import makeCopyWebpackPlugin from './copyWebpackPlugin'
import baseWebpackConfig from './webpack.config.base'

// production
export default (params: BuildParams) => merge(baseWebpackConfig(params, 'production'), {
  mode: 'production',
  output: {
    filename: '[name].bundle.js',
    path: `/var/www/html`
  },
  plugins: [
    makeHtmlWebpackPlugin(params.instanceConfig),
    makeCopyWebpackPlugin(params.appDir),
  ]
})
