import { merge } from 'webpack-merge'
const fs = require('fs').promises
const oldCwd = process.cwd()

/**
 * @exports @function
 * @param {Object} param
 * @return {Object}
 */
module.exports = (params: any) => {
  // dev, prod or lib
  const { webpackConfig } = require(`./webpack.config.${params.mode||'dev'}`)

  const {
    productLogo
  } = (params.externals?.variables||{})

  params.externals = {
    ...(params.externals||{}),
    variables: {
      ...(params.externals.variables||{}),
      workingDir: oldCwd,
      bundleName: params.name,
      productVersion: require(`${oldCwd}/package.json`).version,
      productLogoFile: productLogo
        && (async () => await fs.readFile(`${oldCwd}/assets/${productLogo}`, { encoding: 'base64' }))()
    }
  }

  const config = merge(webpackConfig, {
    externals: Object.entries(params.externals||{})
    .reduce((a, [key, value]) => ({ ...a, [key]: JSON.stringify(value) }), {}),

    output: {
      ...(params.mode === 'prod' ? { path: `/var/www/html/${params.name}` } : {})
    }
  })

  if( params.mode === 'prod' || true ) {
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
