Savitri
=======

> An idiot admires complexity, a genius admires simplicity. A physicist tries
> to make it simples, for an idiot anything the more complicate it is the more
> he will admire it. — Terry A. Davis

Strongely typed, fullstack TypeScript RAD (rapid application development) framework.
It's not a public release yet.

Features
- Builtin authentication
- Builtin file uploading
- Builtin RBAC (role-based access control)
- In-house set of backoffice components
- Schema validation
- Automatic dependency resolution
- Automatic schema references

A minimal one-file API in Savitri looks like this:

```javascript
const { initWithDatabaseThenStart: init } = require('@savitri/api/server')

const descriptions = {
  fruta: {
    $id: 'fruta',
    properties: {
      nome: {
        type: 'string'
      }
    },
    functions: {
      buy: async (props, { log, entity }) => {
        log('bought a fruit', {
          name: props?.nome
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

Todo:
- Improve code splitting and lazyloading
- Whitelabeling support
