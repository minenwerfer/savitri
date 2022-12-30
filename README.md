Savitri
=======

> An idiot admires complexity, a genius admires simplicity. A physicist tries
> to make it simple, for an idiot anything the more complicate it is the more
> he will admire it. — Terry A. Davis

Our philosophy is that most complexity is dumb, and computing is more efficient
when you have fun. So we made it real complex so you can make it real simple.
Savitri is a strongely typed, fullstack TypeScript RAD (rapid application
development) framework you'll enjoy working with.


Features
- Builtin authentication, file uploading and logging
- Builtin RBAC (role-based access control)
- In-house set of backoffice components
- Runtime and static schema validation
- Automatic dependency resolution
- Automatic schema references

A minimal one-file API in Savitri looks like this:

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

Todo:
- Improve code splitting and lazyloading
- Whitelabeling support


## We are looking for contributors!
Join in our Discord server if you're interested in contributing.

