import { readdirSync } from 'fs'

/**
 * @exports @const
 * Array of lowercased controller names.
*/
export const commonControllers = readdirSync(`${__dirname}/../../../collections`)

/**
 * @exports @const
 * Retrieves controller class from alias.
 */
export const getController = (controller: string) => {
  const controllerPath = (() => {
    const module = (globalThis.modules||[])
      .find(({ exportedCollections }: { exportedCollections: Array<string> }) => {
        return exportedCollections?.includes(controller)
      })

    if( module ) {
      return `${process.cwd()}/../../node_modules/${module.name}/collections`
    }

    return commonControllers.includes(controller)
      ? `${__dirname}/../../../collections`
      : `${process.cwd()}/collections`
  })()

  const sanitizedName = controller.replace(/\./g, '') as string & { capitalize: () => string }

  const controllerFile = `${sanitizedName}/${sanitizedName}.controller`
  const controllerName = `${sanitizedName.capitalize()}Controller`

  const Controller = require(`${controllerPath}/${controllerFile}`)[controllerName]

  return Controller
}

export * from './abstract/Controller'
export * from './abstract/Mutable'
