import YAML from 'yaml'
import path from 'path'
import { Controller } from '../../../api/core/controller'

const { readFile } = require('fs').promises

const MAX_ENTRIES = 32

export class ReleaseController extends Controller {
  constructor() {
    super({
      controller: 'release',
    })
  }

  public async getAll() {
    const baseRelease = await readFile(path.resolve(__dirname, '../../../api/RELEASE.yml'), 'utf8')
    const productRelease = await readFile(path.resolve(process.cwd(), './RELEASE.yml'), 'utf8')

    const base = YAML.parse(baseRelease).slice(0, MAX_ENTRIES)
    const product = YAML.parse(productRelease).slice(0, MAX_ENTRIES)

    return {
      base,
      product
    }
  }
}
