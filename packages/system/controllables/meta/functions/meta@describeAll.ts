import type { ApiFunction } from '../../../../api/types'
import { getDescriptions } from '../meta.helper'

const describeAll: ApiFunction<unknown> = (_props, _token, context) => {
  const descriptions = getDescriptions(context.apiConfig.dynamicCollections)
  return {
    descriptions,
    roles: context.apiConfig.roles
  }
}

export default describeAll
