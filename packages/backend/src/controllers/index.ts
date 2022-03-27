/**
 * @exports @const
 * Array of lowercased controller names.
*/
export const commonControllers = [
  'accessProfile',
  'application',
  'feedback',
  'file',
  'notification',
  'release',
  'report',
  'user',
]

/**
 * @exports @const
 * Retrieves controller class from alias.
 */
export const getController = (controller: string) => {
  const controllerPath = commonControllers.includes(controller)
    ? __dirname
    : `${process.cwd()}/api-assets/controllers`

  const controllerFile = `${controller.replace(/\./g, '')}.ctl`
  const controllerName = `${(controller.replace(/\./g, '') as any).capitalize()}Controller`

  const Controller = require(`${controllerPath}/${controllerFile}`)[controllerName]

  return Controller
}
