#!/usr/bin/env node

const { readFileSync } = require('fs')

import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import makeConfig from './make-config'

declare namespace global {
  let appDir: string
}

const filename = 'build.json'
const mode = process.argv[2];

(() => {
  try {
    const content = JSON.parse( readFileSync(filename) )
    
    const buildConfig = Object.assign(content, {
      mode,
      name: process.cwd().split('/').pop(),
    })

    global.appDir = process.cwd()
    process.chdir(__dirname)

    const config = makeConfig(buildConfig)
    const compiler = webpack(config)

    if( ['prod', 'lib'].includes(mode) ) {
      compiler.run((err: any, stats: any) => console.log((err || stats).toString()))
      return
    }

    const options = {
      hot: false,
      client: false,
      compress: true,
      allowedHosts: 'all',
      historyApiFallback: {
        index: '/'
      }
    }

    const server = new WebpackDevServer(options, compiler)
    server.startCallback(() => console.log('Listening'))

  } catch(error) {
    // webpack drops a thousand lines of error
    console.trace(error)
  }
})()
