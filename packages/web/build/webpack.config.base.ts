import path from 'path'
const { VueLoaderPlugin } = require('vue-loader')
// const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default
// const CircularDependencyPlugin = require('circular-dependency-plugin')
//
declare namespace global {
  const appDir: string
}

const baseWebpackConfig = {
  // entry file
  entry: path.resolve(__dirname, global.appDir),

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
      '@': global.appDir,
    }
  },

  // define loaders for each extension
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
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
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
    // new WatchExternalFilesPlugin({
    //   files: [
    //     '../../components/**/*.vue'
    //   ]
    // }),
    // new CircularDependencyPlugin({
    //   exclude: /(node_modules|\.vue)/,
    //   failOnError: true,
    //   allowAsyncCicles: false,
    //   cwd: global.appDir
    // })
  ],

  // optimization, mainly for production builds
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },

  stats: {
    errorDetails: true
  },
}

try {
  module.paths.push(`${global.appDir}/../../node_modules`)
  const tailwindAddon: any = require('@savitri/addon-tailwind').default;
  (baseWebpackConfig.module.rules[2].use as Array<string>).push(
    tailwindAddon
  )
} catch(err ) {
  // throw err
}

export {
  baseWebpackConfig
}
