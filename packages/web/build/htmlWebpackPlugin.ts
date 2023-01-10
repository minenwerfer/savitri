import HtmlWebpackPlugin from 'html-webpack-plugin'
import type { InstanceConfig } from './types'

export default (instanceConfig: InstanceConfig) => {
  return new HtmlWebpackPlugin({
    base: '/',
    inject: 'body',
    template: '../static/index.ejs',
    templateParameters: {
      instanceConfig
    }
  })
}
