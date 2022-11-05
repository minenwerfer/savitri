import * as R from 'ramda'
import path from 'path'
const { writeFile } = require('fs').promises

import type { DecodedToken } from '../../../api/types'
import { fromEntries } from '../../../common/helpers'
import * as Collection from '../../../common/collection'
import type { CollectionField } from '../../../common/types'
import { Mutable, getController } from '../../../api/core/controller'

import { ReportDocument, default as Report } from './report.model'
import { default as Description } from './index.json'

import File from '../file/file.model'

export class ReportController extends Mutable<ReportDocument> {
  private readonly _formatMap: any = {
    'csv': this._saveCSV,
    'pdf': this._savePDF
  }

  constructor() {
    super(Report, Description)

  }

  private _getFields(description: any) {
    const filter = (entries: any): any => {
      return fromEntries(entries.filter(([_, value]: [unknown, any]) => !value.noreport))
    }

    const table = description.reportFields || description.table

    const entries = !table
      ? Object.entries(description.fields)
      : Object.entries(description.fields)
        .filter(([key, _]: [string, unknown]) => table.includes(key))

    return filter(entries)
  }

  private _getColumns(fields: Array<CollectionField>) {
    return Object.values(fields).map((f: { label: string }) => f.label)
  }

  private _filename(ext: string) {
    if( !process.env.REPORTS_PATH ) {
      throw new Error('REPORTS_PATH not set')
    }

    return `report_${Date.now().toString()}.${ext}`
  }

  private async _saveCSV(columns: Array<string>, rows: Array<any>) {
    const filename = this._filename('csv')
    const buffer = rows.reduce((a: string, r: any) => (
      a.concat(Object.values(r).join(',') + '\n')

    ), columns.join(',') + '\n')

    await writeFile(path.join(process.env.REPORTS_PATH!, filename), buffer)
    return {
      filename,
      mime: 'text/csv'
    }
  }

  private async _savePDF() {
    throw new Error('not implemented')
  }

  public override async insert(props: { what: any }, token: DecodedToken) {
    const {
      _collection: collectionName,
      type,
      format,

    } = props.what||{}

    if(
      !collectionName
      || !type
      || !format
    ) {
      throw new Error(
        `Please fill in all required props`
      )
    }
    
    if( !(format in this._formatMap) ) {
      throw new Error('formato inválido')
    }

    if( !this.isGranted(token, 'report', collectionName) ) {
      throw new Error('forbidden method (hasnt report granted)')
    }

    props.what.filters = type !== 'everything'
      ? (props.what.filters || {})
      : {}

    const Controller = getController(collectionName)
    const instance = new Controller
    instance.injected = this.injected

    const description = instance.describe()

    if( !description.report ) {
      throw new Error('você não pode gerar um relatório desse módulo')
    }

    const fields = this._getFields(description)
    const columns = this._getColumns(fields)

    const fieldsNames = Object.keys(fields)

    const result = await instance.getAll({
      filters: props.what.filters,
      limit: +(props.what.limit || 99999999),
      offset: +(props.what.offset || 0)
    })

    const pipe = R.pipe(
      (r: any) => fieldsNames.reduce((a: any, b: string) => ({ ...a, [b]: r[b] ? r[b] : '' }), {}),
      (r: ReportDocument) => Object.entries(r)
        .reduce((a: any, [key, value]: [string, any]) => {
          if( !(key in fields) ) {
            return a
          }

          return {
            ...a,
            [key]: (() => {
              const val = Collection.formatValue(description, value, key, fields[key])
              return val.includes(',') && format === 'csv'
                ? `"${val}"`
                : val
            })()
          }
        }, {})
    )
    const rows = result
      .map(pipe)

    const func = this._formatMap[format]
    const { filename, mime } = await func.call(this, columns, rows)

    props.what.entries_count = rows.length
    props.what.file = await File.create({
      owner: token.user._id,
      context: 'report',
      filename,
      mime,
      absolute_path: path.join(process.env.REPORTS_PATH!, filename),
      immutable: true
    })

    return super.insert.call(this, props)
  }
}
 
