/**
 * @exports @const
 * Array of lowercased controller names.
*/
export const commonControllers = [
  'user',
  'accessProfile',
  'feedback',
  'file',
  'notification',
  'application',
  'report'
]

/**
 * @exports @const
 * Retrieves controller class from alias.
 */
export const getController = (controller: string) => {
  const controllerPath = commonControllers.includes(controller)
    ? __dirname
    : `${process.cwd()}/api-assets/controllers`

  const controllerName = `${(controller.replace(/\./g, '') as any).capitalize()}Controller`
  const Controller = require(`${controllerPath}/${controllerName}`)[controllerName]

  return Controller
}
