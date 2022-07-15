import { mongoose } from '../../core/database'
import { Controller } from '../../core/controller'
import { MetaController } from '../meta/meta.controller'

export class SearchableController extends Controller<unknown> {
  constructor() {
    super({
      publicMethods: ['search'],
      description: {
        module: 'searchables'
      }
    })
  }

  public _buildAggregations(searchables: any, query: Array<string>) {
    const aggregations: Record<string, any> = {}

    Object.entries(searchables).forEach(([moduleName, config]: [string, any]) => {
      const matches = Object.entries(config.indexes).reduce((a: any, [indexName, index]: [string, any]) => {
        const getType: any = (q: any) => {
          switch(index.type) {
            case 'number':
            case 'integer':
            case 'float':
              return Number(q)
            case 'text':
            default:
              return {
                $regex: q,
                $options: 'i'
            }
          }
        }

        return {
          $or: [
            ...a.$or,
            ...query.map((q: string) => ({ [indexName]: getType(q) }))
          ]
        }

      }, { $or: [] })

      const project = Object.keys(config.indexes).reduce((a: any, index: string) => ({ ...a, [index]: 1 }), {})
      if( config.picture ) {
        project._picture = `$${config.picture}`
      }

      aggregations[moduleName] = [
        { $match: matches },
        { $limit: 5 },
        { $project: project }
      ]
    })

    return aggregations
  }

  public async search(props: { query: Array<string> }, _: unknown, decodedToken: any) {
    if( !decodedToken?.access?.capabilities ) {
      throw new Error('signed out')
    }

    props.query = props.query.filter((q: string) => !!q)
    if( !props?.query || props.query.length === 0 ) {
      throw new Error('no query provided')
    }

    const { capabilities } = decodedToken.access
    const searchables = Object.entries(MetaController.getSearchables()).reduce((a: any, [key, value]: [string, any]) => {
      return {
        ...a,
        ...(capabilities[key].includes('getAll') ? { [key]: value } : {})
      }
    }, {})

    const aggregations = this._buildAggregations(searchables, props.query)
    const result: { [key: string]: any } = {}

    for (const [moduleName, aggregation] of Object.entries(aggregations)) {
      result[moduleName] = await mongoose.model(moduleName).aggregate(aggregation)
    }

    return result
  }
}
