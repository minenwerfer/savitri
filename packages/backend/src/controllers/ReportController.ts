import { ReportDocument, Report, Description } from '../models/Report'
import { Mutable } from './abstract/Mutable'

export class ReportController extends Mutable<ReportDocument> {
  constructor() {
    super(Report, Description, {
      publicMethods: ['getAll']
    })
  }
}
