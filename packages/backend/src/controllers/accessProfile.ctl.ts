import { AccessProfileDocument, AccessProfile, Description } from '../models/AccessProfile'
import { Mutable } from './abstract/Mutable'

export class AccessProfileController extends Mutable<AccessProfileDocument> {
  constructor() {
    super(AccessProfile, Description, {
      publicMethods: ['getAll']
    })
  }
}
