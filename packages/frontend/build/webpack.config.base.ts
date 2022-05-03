const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

export const baseWebpackConfig = {
  // entry file
  entry: path.resolve(__dirname, `${global.appDir}/src`),

  // resolve typescript along with js
  resolve: {
    extensions: [
      '.js',
      '.ts',
      '.vue'
    ],
    modules: [
      path.resolve(__dirname, '../node_modules'),
      path.resolve(global.appDir, './node_modules'),
      path.resolve(global.appDir, '../../node_modules')
    ],
    alias: {
      // shorthand for application directory
      // or the current working dir
      '@': `${global.appDir}/src`,
    }
  },

  // define laoders for each extension
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(svg|png)/,
        use: 'file-loader'
      },
    ]
  },

  // these plugins will be included by default
  plugins: [
    new VueLoaderPlugin(),
  ],

  // optimization, mainly for production builds
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },

  stats: {
    errorDetails: true
  }
}
