import { Controller } from '../../core/controller'
import { preloadEntity } from '../../core/entity'

const { readdirSync, existsSync } = require('fs')

export class MetaController extends Controller<unknown> {
  constructor() {
    super({
      publicMethods: ['describeAll'],
      description: {
        module: 'meta'
      }
    })
  }

  private _getDescriptions(): any {
    const modulePaths = [
      `${__dirname}/..`,
      `${process.cwd()}/entities`,
      ...global.modules
        ? global.modules.map(({ name }: { name: string }) => `${process.cwd()}/../../node_modules/${name}/dist/backend/entities`)
        : []
    ]

    const modules = modulePaths
      .reduce((a: any, dir: string) => ({
        ...a,
        ...readdirSync(dir)
          .filter((d: string) => !d.startsWith('_'))
          .filter((d: string) => existsSync(`${dir}/${d}/index.json`))
          .reduce((a: any, d: string) => ({ ...a, [d]: preloadEntity(require(`${dir}/${d}/index.json`)) }), {})
      }), {})

    return modules
  }

  public describeAll() {
    const descriptions = this._getDescriptions()

    // Object.keys(descriptions).forEach((key: string) => {
    //   const description = descriptions[key]
    //   description.presets?.forEach((name: string) => {
    //     applyPreset(description, name)
    //   })
    // })

    return descriptions
  }
}
