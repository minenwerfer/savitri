Savitri
=======

> An idiot admires complexity, a genius admires simplicity. A physicist tries
> to make it simple, for an idiot anything the more complicate it is the more
> he will admire it. — Terry A. Davis


## Features

- Builtin authentication, file uploading and logging
- Builtin RBAC (role-based access control)
- In-house set of backoffice components
- Runtime and static schema validation
- Automatic dependency resolution
- Automatic schema references


## The 30 seconds example

This is a minimal, yet fully-fledged Savitri API contained in a single file (suitable for rapid prototyping). Supposing no MONGODB_URI is passed either via object config or via environment variables, data will be stored in memory and will be only available during runtime.

```javascript
const { initWithDatabaseThenStart: init } = require('@savitri/api/server')

const descriptions = {
  fruta: {
    $id: 'fruta',
    properties: {
      name: {
        type: 'string'
      }
    },
    functions: {
      buy: (props, { log, entity, validate }) => {
        validate(props, ['name'])
        log('bought a fruit', {
          name: props.name
        })

        return entity.bye()
      },
      bye: () => 'Obrigado, volte sempre'
    }
  },
  animal: {
    $id: 'animal',
    properties: {
      nome: {
        type: 'string'
      },
      tipo: {
        enum: [
          'herbívoro',
          'carnívoro',
          'onívoro'
        ]
      }
    }
  }
}

init({ descriptions })
```


## Packages

| Name              | Status                                              |
| ---               | ---                                                 |
| [savitri-api]     | [![savitri-api-status]][savitri-api-package]        | Semantic API implementation
| [savitri-web]     | [![savitri-web-status]][savitri-web-package]        | Web bindings for API
| [savitri-ui]      | [![savitri-ui-status]][savitri-ui-package]          | Backoffice UI kit

[savitri-api]: https://test.com/
[savitri-web]: https://test.com/
[savitri-ui]: https://test.com/
[savitri-api-status]: https://img.shields.io/npm/v/@savitri/api.svg
[savitri-web-status]: https://img.shields.io/npm/v/@savitri/web.svg
[savitri-ui-status]: https://img.shields.io/npm/v/@savitri/ui.svg
[savitri-api-package]: https://npmjs.com/package/@savitri/api
[savitri-web-package]: https://npmjs.com/package/@savitri/web
[savitri-ui-package]: https://npmjs.com/package/@savitri/ui


## Todo

- Improve code splitting and lazyloading
- Whitelabeling support


## We are looking for contributors!

Join in our Discord server if you're interested in contributing.

