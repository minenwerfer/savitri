import path from 'path'
import type { Configuration } from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
// const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default
// const CircularDependencyPlugin = require('circular-dependency-plugin')
//

const baseWebpackConfig = (appDir: string): Configuration => {
  const config = {
    entry: path.resolve(__dirname, appDir),
    resolve: {
      extensions: [
        '.js',
        '.ts',
        '.vue'
      ],
      modules: [
        path.resolve(__dirname, '../node_modules'),
        path.resolve(appDir, './node_modules'),
        path.resolve(appDir, '../../node_modules')
      ],
      alias: {
        // shorthand for application directory
        // or the current working dir
        '@': appDir,
        '~': path.resolve(__dirname, '..'),
        'style': path.resolve(__dirname, '../../ui/scss'),
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            reactivityTransform: true
          }
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
          test: /\.(svg|png|jpg|jpeg|webp)/,
          use: 'file-loader'
        },
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      // new WatchExternalFilesPlugin({
      //   files: [
      //     '../../ui/**/*.vue'
      //   ]
      // }),
      // new CircularDependencyPlugin({
      //   exclude: /(node_modules|\.vue)/,
      //   failOnError: true,
      //   allowAsyncCicles: false,
      //   cwd: appDir
      // })
    ],
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
    module.paths.push(`${appDir}/../../node_modules`)
    const tailwindAddon: any = require('@savitri/addon-tailwind').default;
    (config.module.rules[2].use as Array<string>).push(
      tailwindAddon
    )
  } catch(err ) {
    // throw err
  }

  return config as Configuration
}

export default baseWebpackConfig
