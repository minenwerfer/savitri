import path from 'path'
import { Controller } from '../../api/core/controller'
import { default as manifestContent } from '../../api/resources/manifest.json'
import { replacePlaceholders } from './application.helper'

const { readFile } = require('fs').promises

const buildConfig = require(path.join(process.cwd(), 'build.json'))

export class ApplicationController extends Controller<unknown> {
  constructor() {
    super({
      publicMethods: [
        'manifest',
        'serviceWorker',
        'index'
      ],
      rawMethods: {
        'manifest': 'application/json',
        'serviceWorker': 'text/javascript',
        'index': 'text/html'
      },
      description: {
        collection: 'application'
      }
    })
  }

  public manifest() {
    return Object.assign(manifestContent, {
      name: buildConfig.product.name,
      short_name: buildConfig.product.shortName || buildConfig.product.name,
      description: buildConfig.product.description,
      theme_color: buildConfig.product.theme.foregroundColor,
      background_color: buildConfig.product.theme.backgroundColor,
    })
  }

  public async serviceWorker() {
    const content = await readFile(path.join(__dirname, '../../resources/serviceWorker.js'))
    return content
  }

  public async index() {
    const content = await readFile(path.join(__dirname, '../../resources/index.html'))
    const initial_data = JSON.stringify(buildConfig)

    const config = Object.assign(buildConfig.product, {
      title: buildConfig.product.name,
      theme_color: buildConfig.product.theme.foregroundColor,
      background_color: buildConfig.product.theme.backgroundColor,
      initial_data
    })

    return replacePlaceholders(content.toString(), config)
  }
}
