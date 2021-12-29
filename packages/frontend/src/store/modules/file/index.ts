import { Module, ActionProps } from 'frontend/store/module'
import { AxiosResponse } from 'common/http'

export class FileModule extends Module<{}, {}> {
  constructor() {
    super('file', {}, {})
  }
}
