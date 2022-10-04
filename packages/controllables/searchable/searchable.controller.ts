import { mongoose } from '../../api/core/database'
import { Controller } from '../../api/core/controller'
import { AuthorizationError } from '../../api/core/exceptions'
import { getSearchables, buildAggregations } from './searchable.helper'

export class SearchableController extends Controller {
  constructor() {
    super({
      controller: 'searchable',
    })
  }

  public async search(props: { query: Array<string> }, decodedToken: any) {
    if( !decodedToken?.user?.role ) {
      throw new AuthorizationError('signed out')
    }

    props.query = props.query.filter((q: string) => !!q)
    if( !props?.query || props.query.length === 0 ) {
      throw new Error('no query provided')
    }

    const searchables = Object.entries(getSearchables())
      .reduce((a: any, [key, value]: [string, any]) => {
        if( !this.isGranted(decodedToken, 'getAll', key) ) {
          console.log(key)
          return a
        }

        return {
          ...a,
          [key]: value
        }
    }, {})

    const beforeRead = this.apiConfig.beforeRead
      ? (collectionName: string) => this.apiConfig.beforeRead!(decodedToken, collectionName)
      : null

    const aggregations = buildAggregations(
      searchables,
      props.query,
      beforeRead
    )

    const result: Record<string, any> = {}

    for (const [collectionName, aggregation] of Object.entries(aggregations)) {
      result[collectionName] = await mongoose.model(collectionName).aggregate(aggregation)
    }

    return result
  }
}
