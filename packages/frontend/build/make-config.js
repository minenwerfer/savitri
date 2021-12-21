const { merge } = require('webpack-merge')

/**
 * @exports @function
 * @param {Object} param
 * @return {Object}
 */
module.exports = (params) => {

  // dev, prod or lib
  const webpackConfig = require(`./webpack.config.${params.mode||'dev'}`)

  params.externals.variables = {
    ...(params.externals.variables||{}),
    bundleName: params.name
  }

  return merge(webpackConfig, {
    externals: Object.entries(params.externals||{})
    .reduce((a, [key, value]) => ({ ...a, [key]: JSON.stringify(value) }), {})
  })
}
