import HtmlWebpackPlugin from 'html-webpack-plugin'
import merge from './merge'
import baseWebpackConfig from './webpack.config.base'

// production
export default (appDir: string) => merge(baseWebpackConfig(appDir), {
  mode: 'production',
  devtool: 'eval-source-map',

  output: {
    filename: '[name].bundle.js',
    path: `/var/www/html`
  },

  plugins: [
    new HtmlWebpackPlugin({
      base: '/',
      inject: 'body',
      template: '../static/index.ejs'
    }),
  ]
})
