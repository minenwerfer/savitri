#!/usr/bin/env node

const { readFileSync } = require('fs')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const makeConfig = require('./make-config')

const filename = process.argv[2]
const mode = process.argv[3]

if( !filename ) {
  throw 'Target not specified'
}

try {
  const content = JSON.parse( readFileSync(filename) )
  if( mode ) {
    content.mode = mode
  }

  global.appDir = process.cwd()
  process.chdir(__dirname)

  const config = makeConfig(content)
  const compiler = webpack(config)

  if( ['prod', 'lib'].includes(mode) ) {
    compiler.run((err, stats) => console.log((err || stats).toString()))
    return
  }

  const options = {
    compress: true,
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
