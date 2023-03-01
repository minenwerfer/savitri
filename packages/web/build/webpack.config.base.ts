import path from 'path'
import { VueLoaderPlugin } from 'vue-loader'
import type { Configuration } from 'webpack'
import type { BuildParams } from './types'
// import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import sassData from './sassData'
// const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default
// const CircularDependencyPlugin = require('circular-dependency-plugin')
//

const baseWebpackConfig = (params: BuildParams, mode?: 'production'): Configuration => {
  const { appDir } = params

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
            // ...[
            //   mode === 'production'
            //     ? MiniCssExtractPlugin.loader
            //     : 'vue-style-loader'
            // ],
            'vue-style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            // ...[
            //   mode === 'production'
            //     ? MiniCssExtractPlugin.loader
            //     : 'vue-style-loader'
            // ],
            'vue-style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                additionalData: sassData(params.instanceConfig)
              }
            }
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
      // new MiniCssExtractPlugin()
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
    externals: {
      // path required by 'bson' module
      'node:crypto': {},
      'crypto': {},
    }
  }

  try {
    console.log(`${appDir}/../../node_modules`)
    module.paths.push(`${appDir}/../../node_modules`)
    const tailwindAddon: any = require('@savitri/addon-tailwind').default(appDir);

    (config.module.rules[2].use as Array<string>).push(
      tailwindAddon
    )
  } catch(err ) {
    // throw err
  }

  return config as Configuration
}

export default baseWebpackConfig
