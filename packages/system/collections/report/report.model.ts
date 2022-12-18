import { createModel } from '../../../api/core/collection'
import { Report, default as ReportDescription } from './report.description'

export default createModel<Report>(ReportDescription)
