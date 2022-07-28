import { merge } from 'webpack-merge'
// const { readFileSync } = require('fs')

const oldCwd = process.cwd()

export default (params: any) => {
  // dev, prod or lib
  const { webpackConfig } = require(`./webpack.config.${params.mode||'dev'}`)

  params.externals = {
    ...(params.externals||{}),
    variables: {
      ...(params.externals.variables||{}),
      workingDir: oldCwd,
      bundleName: params.name,
      productVersion: require(`${oldCwd}/package.json`).version,
      // productLogoFile: productLogo
      //   && readFileSync(`${oldCwd}/assets/${productLogo}`, { encoding: 'base64' })
    }
  }

  const config = merge(webpackConfig, {
    externals: {
      ...Object.entries(params.externals||{}).reduce((a, [key, value]) => ({ ...a, [key]: JSON.stringify(value) }), {}),

    },

   // resolve: {
   //    alias: {
   //      'variables': `${oldCwd}/build.json`
   //    },
   //  },

    output: params.mode === 'prod'
      ? { path: `/var/www/html/${params.name}` }
      : {}
  })

  // if( params.mode === 'prod' ) {
    config.module.rules = config.module.rules
      .map((r: any) => r.loader !== 'ts-loader' ? r : {
        ...r,
        options: {
          ...r.options,
          transpileOnly: true
        }
      })
  // }

  return config
}
