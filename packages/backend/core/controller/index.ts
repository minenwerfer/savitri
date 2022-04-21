const { readdirSync } = require('fs')

/**
 * @exports @const
 * Array of lowercased controller names.
*/
export const commonControllers = readdirSync(`${__dirname}/../../modules`)
/**
 * @exports @const
 * Retrieves controller class from alias.
 */
export const getController = (controller: string) => {
  const controllerPath = commonControllers.includes(controller)
    ? `${__dirname}/../../modules`
    : `${process.cwd()}/modules`

  const sanitizedName = controller.replace(/\./g, '') as string & { capitalize: () => string }

  const controllerFile = `${sanitizedName}/${sanitizedName}.controller`
  const controllerName = `${sanitizedName.capitalize()}Controller`

  const Controller = require(`${controllerPath}/${controllerFile}`)[controllerName]

  return Controller
}

export * from './abstract/Controller'
export * from './abstract/Mutable'
