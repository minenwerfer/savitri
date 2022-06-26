import { mongoose } from '../../core/database'
import { Controller } from '../../core/controller'
import { MetaController } from '../meta/meta.controller'

export class SearchableController extends Controller<unknown> {
  constructor() {
    super({
      publicMethods: ['test'],
      description: {
        module: 'searchable'
      }
    })
  }

  public _buildAggregations(query: Array<string>) {
    const searchable = MetaController.getSearchables()
    const aggregations: { [key: string]: any } = {}

    Object.entries(searchable).forEach(([moduleName, config]: [string, any]) => {
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

      aggregations[moduleName] = [
        { $match: matches },
        { $limit: 5 },
        { $project: Object.keys(config.indexes).reduce((a: any, index: string) => ({ ...a, [index]: 1 }), {}) }
      ]
    })

    return aggregations
  }

  public async search(props: { query: Array<string> }) {
    if( !props?.query || props.query.some((q: string) => !q) ) {
      throw new Error('no query provided')
    }

    const aggregations = this._buildAggregations(props.query)
    const result: { [key: string]: any } = {}

    for (const [moduleName, aggregation] of Object.entries(aggregations)) {
      result[moduleName] = await mongoose.model(moduleName).aggregate(aggregation)
    }

    return result
  }
}
