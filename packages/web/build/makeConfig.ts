import { merge } from 'webpack-merge'
import type { BuildParams } from './types'
// const { readFileSync } = require('fs')

// const oldCwd = process.cwd()

export default (params: BuildParams) => {
  const { buildConfig } = params

  // dev, prod or lib
  const modes = {
    library: 'lib',
    production: 'prod',
    development: 'dev'
  }
  
  const targetMode = buildConfig.mode as keyof typeof modes
  delete buildConfig.mode

  const webpackConfig = require(`./webpack.config.${modes[targetMode]||'dev'}`).default(params)

  const config = merge(webpackConfig, {
    ...buildConfig,
    output: targetMode === 'production'
      ? { path: `/var/www/html/${buildConfig.name}` }
      : {}
  })

  if( buildConfig.tsTranspileOnly || targetMode === 'library' ) {
    delete config.tsTranspileOnly
    config.module.rules = config.module.rules
      .map((r: any) => r.loader !== 'ts-loader' ? r : {
        ...r,
        options: {
          ...r.options,
          transpileOnly: true
        }
      })
  }

  return config
}
