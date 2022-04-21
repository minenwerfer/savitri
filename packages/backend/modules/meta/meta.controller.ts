import { Controller } from '../../core/controller'
import { applyPreset } from '../../core/entity'

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
    const modules = [ `${__dirname}/..`, `${process.cwd()}/modules` ]
      .reduce((a: any, dir: string) => ({
        ...a,
        ...readdirSync(dir)
          .filter((d: string) => existsSync(`${dir}/${d}/index.json`))
          .reduce((a: any, d: string) => ({ ...a, [d]: require(`${dir}/${d}/index.json`) }), {})

      }), {})

    return modules
  }

  public describeAll() {
    const descriptions = this._getDescriptions()

    Object.keys(descriptions).forEach((key: string) => {
      const description = descriptions[key]
      description.presets?.forEach((name: string) => {
        applyPreset(description, name)
      })
    })

    return descriptions
  }
}
