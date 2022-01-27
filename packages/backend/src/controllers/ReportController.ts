const { writeFile } = require('fs').promises
const path = require('path')

import { ReportDocument, Report, Description } from '../models/Report'
import { Mutable } from './abstract/Mutable'
import { getController } from './index'

import { File } from '../models/File'

export interface ReportController {
  formatMap: any
}

export class ReportController extends Mutable<ReportDocument> {
  constructor() {
    super(Report, Description, {
      publicMethods: ['getAll']
    })

    this.formatMap = {
      'csv': this._saveCSV,
      'pdf': this._savePDF
    }
  }

  private _getFields(description: any) {
    return !description.table
      ? description.fields
      : Object.entries(description.fields)
        .filter(([key, _]: [string, unknown]) => description.table.includes(key))
        .reduce((a: any, [key, value]: [string, any]) => ({ ...a, [key]: value }), {})
  }

  private _getColumns(fields: any[]) {
    return Object.values(fields).map((f: { label: string }) => f.label)
  }

  private _formatValue(field: any, value: any) {
    if(!value || typeof value !== 'object' ) {
      return value ? value : '-'
    }

    const getFirstValue = (v: any, index: string) => {
      const entry = Array.isArray(field.values)
        ? field.values[0]
        : field.values

      if( entry?.__query ) {
        return v[entry.__query.index]
      }

      const i = Array.isArray(index) ? index[0] : index
      return v[i]
    }

    return Array.isArray(value)
      ? value.map((v: any) => getFirstValue(v, field.index)).join(', ')
      : getFirstValue(value, field.index)
  }

  private _filename(ext: string) {
    if( !process.env.REPORTS_PATH ) {
      throw new Error('REPORTS_PATH not set')
    }

    return `report_${Date.now().toString()}.${ext}`
  }

  private async _saveCSV(columns: string[], rows: any[]) {
    const filename = this._filename('csv')
    const buffer = rows.reduce((a: string, r: any) => (
      a.concat(Object.values(r).join(',') + '\n')

    ), columns.join(',') + '\n')

    await writeFile(path.join(process.env.REPORTS_PATH, filename), buffer)
    return {
      filename,
      mime: 'text/csv'
    }
  }

  private async _savePDF(columns: string[], rows: any[]) {
    throw new Error('not implemented')
  }

  public override async insert(props: { what: any }, req: unknown, decodedToken: any) {

    if( !props.what?.format ) {
      throw new Error('especifique um formato')
    }

    if( !(props.what?.format in this.formatMap) ) {
      throw new Error('formato inválido')
    }

    props.what.user_id = decodedToken._id
    props.what.filters = props.what.type !== 'everything'
      ? (props.what.filters || {})
      : {}

    const Controller = getController(props.what.module)
    const instance = new Controller

    const description = instance.describe()

    if( !description.report ) {
      throw new Error('você não pode gerar um relatório desse módulo')
    }

    const fields = this._getFields(description)
    const columns = this._getColumns(fields)

    const fieldsNames = Object.keys(fields)

    const result = await instance.getAll({
      filters: props.what.filters,
      ...(props.what.type === 'everything' ? { limit: 999999 } : {})
    })

    const rows = result
      .map((r: any) => r._doc || r)
      .map((r: any) => fieldsNames.reduce((a: any, b: string) => ({ ...a, [b]: r[b] ? r[b] : '' }), {}))
      .map((r: any) => {
      return Object.entries(r)
        .filter(([key]: [string, any]) => key in fields)
        .reduce((a: any, [key, value]: [string, any]) => ({
          ...a,
          [key]: this._formatValue(fields[key], value)
        }), {})
    })

    const func = this.formatMap[props.what.format]
    const { filename, mime } = await func.call(this, columns, rows)

    props.what.file = await File.create({
      user_id: decodedToken._id,
      context: 'report',
      filename,
      mime,
      absolute_path: path.join(process.env.REPORTS_PATH, filename),
      immutable: true
    })

    return super.insert.call(this, props)
  }

  public async download(_id: string) {
    const file = Report.findOne({ _id }).lean()
    if( !file ) {
      throw new Error('report not found')
    }
  }
}
 
