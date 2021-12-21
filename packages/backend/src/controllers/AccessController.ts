import { AccessDocument, Access, Description } from '../models/Access'
import { Mutable } from './abstract/Mutable'

export class AccessController extends Mutable<AccessDocument> {
  constructor() {
    super(Access, Description, {
      publicMethods: ['getAll']
    })
  }
}
