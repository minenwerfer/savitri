import { mongoose } from '../../api/core/database'
import { Controller } from '../../api/core/controller'
import { AuthorizationError } from '../../api/core/exceptions'
import { getSearchables, buildAggregations } from './searchable.helper'

export class SearchableController extends Controller {
  constructor() {
    super({
      controller: 'searchable',
      publicMethods: ['search'],
    })
  }

  public async search(props: { query: Array<string> }, _: unknown, decodedToken: any) {
    if( !decodedToken?.access?.capabilities ) {
      throw new AuthorizationError('signed out')
    }

    props.query = props.query.filter((q: string) => !!q)
    if( !props?.query || props.query.length === 0 ) {
      throw new Error('no query provided')
    }

    const { capabilities } = decodedToken.access
    const searchables = Object.entries(getSearchables())
      .reduce((a: any, [key, value]: [string, any]) => ({
        ...a,
        ...(capabilities[key].includes('getAll') ? { [key]: value } : {})
      }), {})

    const aggregations = buildAggregations(searchables, props.query)
    const result: Record<string, any> = {}

    for (const [collectionName, aggregation] of Object.entries(aggregations)) {
      result[collectionName] = await mongoose.model(collectionName).aggregate(aggregation)
    }

    return result
  }
}
