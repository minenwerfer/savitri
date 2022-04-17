import YAML from 'yaml'
import { Controller } from '../../src/controller'

const path = require('path')
const { readFile } = require('fs').promises

export class ReleaseController extends Controller<unknown> {
  constructor() {
    super({
      description: {
        module: 'release'
      }
    })
  }

  public async getAll() {
    const baseRelease = await readFile(path.resolve(__dirname, '../../RELEASE.yml'), 'utf8')
    const productRelease = await readFile(path.resolve(process.cwd(), './RELEASE.yml'), 'utf8')

    const base = YAML.parse(baseRelease)
    const product = YAML.parse(productRelease)

    return {
      base,
      product
    }
  }
}
