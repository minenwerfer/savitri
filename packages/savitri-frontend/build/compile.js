#!/usr/bin/env node

const { readFileSync } = require('fs')

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const makeConfig = require('./make-config')

const filename = 'build.json'
const mode = process.argv[3]

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
    compiler.run((err, stats) => console.log((err || stats).toString()))
    return
  }

  const options = {
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
