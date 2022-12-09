import { readdirSync } from 'fs'

export const commonNames = [
  ...readdirSync(`${__dirname}/../../../system/collections`),
  ...readdirSync(`${__dirname}/../../../system/controllables`)
]

/**
 * @exports @const
 * Retrieves controller class from alias.
 */
export const getController = (id:string, type:'collections'|'controllables' = 'collections'): (new () => any) => {
  const controllerPath = (() => {
    const moduleProps = (globalThis.modules||[])
      .find(({ exportedCollections }: { exportedCollections: Array<string> }) => {
        return exportedCollections?.includes(id)
      })

    if( moduleProps ) {
      return `${process.cwd()}/../../node_modules/${moduleProps.name}/${type}`
    }

    return commonNames.includes(id)
      ? `${__dirname}/../../../system/${type}`
      : `${process.cwd()}/${type}`
  })()

  const sanitizedName = id.replace(/\./g, '') as string & { capitalize: () => string }

  const controllerFile = `${sanitizedName}/${sanitizedName}.controller`
  const controllerName = `${sanitizedName.capitalize()}Controller`

  const Controller = require(`${controllerPath}/${controllerFile}`)[controllerName]

  return Controller
}

export * from './controller'
