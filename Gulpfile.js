const { series } = require('gulp')

function build(cb) {
  console.log('a')
  cb()
}

exports.default = series(build)
