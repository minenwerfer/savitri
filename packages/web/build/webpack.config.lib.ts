import path from 'path'
import type { BuildParams } from './types'
import merge from './merge'
import baseWebpackConfig from './webpack.config.base'

// library
export default (params: BuildParams) => merge(baseWebpackConfig(params), {
  mode: 'production',
  devtool: 'eval-source-map',
  entry: {
    index: path.resolve(__dirname, '../../../packages/ui'),
  },
  output: {
    path: path.resolve(__dirname, '../../../dist/ui'),
    filename: '[name].js',
    library: '@savitri/ui',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this'
  },
  optimization: {
    splitChunks: false
  }
})
