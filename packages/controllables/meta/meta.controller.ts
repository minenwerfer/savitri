import { Controller } from '../../api/core/controller'
import { getDescriptions } from './meta.helper'

export class MetaController extends Controller {
  constructor() {
    super({
      controller: 'meta',
      publicMethods: ['describeAll'],
    })
  }

  public describeAll() {
    const descriptions = getDescriptions()
    return {
      descriptions,
      roles: this.apiConfig.roles
    }
  }
}
