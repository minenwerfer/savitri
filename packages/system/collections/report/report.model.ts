import { createModel } from '../../../api/core/collection'
import { Report, ReportDescription } from './report.schema'

export default createModel<Report>(ReportDescription)
