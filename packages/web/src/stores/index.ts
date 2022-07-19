const __stores: Record<string, any> = {}

__stores.user = require('./user').default

module.exports = __stores
