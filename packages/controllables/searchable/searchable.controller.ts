import { mongoose } from '../../api/core/database'
import { Controller } from '../../api/core/controller'
import { getSearchables, buildAggregations } from './searchable.helper'

export class SearchableController extends Controller<unknown> {
  constructor() {
    super({
      publicMethods: ['search'],
      description: {
        module: 'searchables'
      }
    })
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
    const searchables = Object.entries(getSearchables()).reduce((a: any, [key, value]: [string, any]) => {
      return {
        ...a,
        ...(capabilities[key].includes('getAll') ? { [key]: value } : {})
      }
    }, {})

    const aggregations = buildAggregations(searchables, props.query)
    const result: { [key: string]: any } = {}

    for (const [moduleName, aggregation] of Object.entries(aggregations)) {
      result[moduleName] = await mongoose.model(moduleName).aggregate(aggregation)
    }

    return result
  }
}
