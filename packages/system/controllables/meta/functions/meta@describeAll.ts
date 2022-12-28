import type { ApiFunction } from '../../../../api/types'
import { getDescriptions } from '../meta.helper'

const describeAll: ApiFunction<null> = (_props, context) => {
  const descriptions = getDescriptions(context)
  return {
    descriptions,
    roles: context.apiConfig.roles
  }
}

export default describeAll
