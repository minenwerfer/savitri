import { merge } from 'webpack-merge'
// const { readFileSync } = require('fs')

// const oldCwd = process.cwd()

export default (appDir: string) => (params: any) => {
  // dev, prod or lib
  const modes = {
    library: 'lib',
    production: 'prod',
    development: 'dev'
  }
  
  const targetMode: keyof typeof modes = params.mode
  delete params.mode

  const webpackConfig = require(`./webpack.config.${modes[targetMode]||'dev'}`).default(appDir)

  // params.externals ??= {}
  // params.externals.variables ??= {}

  // Object.assign(params.externals.variables, {
  //   workingDir: oldCwd,
  //   bundleName: params.name,
  //   productVersion: require(`${oldCwd}/package.json`).version,
  // })

  const config = merge(webpackConfig, {
    ...params,
    externals: Object.entries(params.externals||{})
      .reduce((a, [key, value]) => ({ ...a, [key]: JSON.stringify(value) }), {}),

   // resolve: {
   //    alias: {
   //      'variables': `${oldCwd}/build.json`
   //    },
   //  },

    output: targetMode === 'production'
      ? { path: `/var/www/html/${params.name}` }
      : {}
  })

  if( params.tsTranspileOnly || targetMode === 'library' ) {
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
