const { merge } = require('webpack-merge')
const oldCwd = process.cwd()

/**
 * @exports @function
 * @param {Object} param
 * @return {Object}
 */
module.exports = (params) => {

  // dev, prod or lib
  const webpackConfig = require(`./webpack.config.${params.mode||'dev'}`)

  params.externals = {
    ...(params.externals||{}),
    variables: {
      ...(params.externals.variables||{}),
      bundleName: params.name,
      productVersion: require(`${oldCwd}/package.json`).version
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
      .map((r) => r.loader !== 'ts-loader' ? r : {
        ...r,
        options: {
          ...r.options,
          transpileOnly: true
        }
      })
  }

  return config
}
