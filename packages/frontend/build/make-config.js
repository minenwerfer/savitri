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

  params.externals.variables = {
    ...(params.externals.variables||{}),
    bundleName: params.name,
    productVersion: require(`${oldCwd}/package.json`).version
  }

  return merge(webpackConfig, {
    externals: Object.entries(params.externals||{})
    .reduce((a, [key, value]) => ({ ...a, [key]: JSON.stringify(value) }), {}),

    output: {
      path: `/var/www/html/${params.name}`
    }
  })
}
