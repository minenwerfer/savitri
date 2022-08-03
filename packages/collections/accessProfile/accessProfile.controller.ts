import { AccessProfileDocument, AccessProfile } from './accessProfile.model'
import { Mutable } from '../../api/core/controller'
import { default as Description } from './index.json'

export class AccessProfileController extends Mutable<AccessProfileDocument> {
  constructor() {
    super(AccessProfile, Description, {
      publicMethods: ['roles']
    })
  }

  roles(): Array<string> {
    return this.injected.roles||[]
  }
}
