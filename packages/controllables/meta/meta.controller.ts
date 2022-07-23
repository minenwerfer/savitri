import { Controller } from '../../api/core/controller'
import { getDescriptions } from './meta.helper'

export class MetaController extends Controller<unknown> {
  constructor() {
    super({
      publicMethods: ['describeAll'],
      description: {
        collection: 'meta'
      }
    })
  }

  public describeAll() {
    const descriptions = getDescriptions()
    return descriptions
  }
}
