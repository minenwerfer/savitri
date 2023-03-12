import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import makeConfig from './makeConfig'
import type { BuildParams } from './types'

const mode = process.argv[2]

const getOptionalFile = (relpath: string) => {
  try {
    return require(`${process.cwd()}/${relpath}`)
  } catch( e ) {
    return {}
  }
}

const main = () => {
  const params: BuildParams = {
    appDir: process.cwd(),
    buildConfig: {
      ...getOptionalFile('build'),
      mode,
      name: process.cwd().split('/').pop(),
    },
    instanceConfig: getOptionalFile('instance')
  }

  params.instanceConfig.icons = [
    ...params.instanceConfig.icons || [],
    'user-circle',
    'search-alt',
    'brackets-curly',
    'file'
  ]

  process.chdir(__dirname)

  const config = makeConfig(params)
  const compiler = webpack(config)

  if( ['production', 'library'].includes(mode) ) {
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
}

main()
