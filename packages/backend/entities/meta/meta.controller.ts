import { Controller } from '../../core/controller'
import { preloadEntity } from '../../core/entity'

const { readdirSync, existsSync } = require('fs')

const __cachedDescriptions: { [key: string]: any } = {}
const __searchable: { [key: string]: any } = {}

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
    if( Object.keys(__cachedDescriptions).length > 0 ) {
      return __cachedDescriptions
    }

    const modulePaths = [
      `${__dirname}/..`,
      `${process.cwd()}/entities`,
      ...global.modules
        ? global.modules.map(({ name }: { name: string }) => `${process.cwd()}/../../node_modules/${name}/backend/entities`)
        : []
    ]

    const descriptions = modulePaths
      .reduce((a: any, dir: string) => ({
        ...a,
        ...readdirSync(dir)
          .filter((d: string) => !d.startsWith('_'))
          .filter((d: string) => existsSync(`${dir}/${d}/index.json`))
          .reduce((a: any, d: string) => ({ ...a, [d]: preloadEntity(require(`${dir}/${d}/index.json`)) }), {})
    }), {})

    Object.assign(__cachedDescriptions, descriptions)
    return descriptions
  }

  public describeAll() {
    const descriptions = this._getDescriptions()
    return descriptions
  }

  public static getSearchables() {
    if( Object.keys(__searchable).length > 0 ) {
      return __searchable
    }

    const descriptions = new MetaController().describeAll()

    const searchable = Object.entries(descriptions)
      .filter(([, description]: [string, any]) => (
        !!description.searchable?.indexes
        && !description.alias
      ))
      .reduce((a: any, [key, description]: [string, any]) => {
        const indexes = description.searchable.indexes.reduce((a: any, index: string) => {
          const field = description.fields[index]
          if( field.module || field.values?.[0]?.__query ) {
            throw new Error('searchable index cannot be a reference')
          }

          const { label, type } = field

          return {
            ...a,
            [index]: {
              label,
              type
            }
          }
        }, {})

        return {
          ...a,
          [key]: {
            ...description.searchable,
            indexes
          }
        }
    }, {})

    Object.assign(__searchable, searchable)
    return searchable
  }
}
