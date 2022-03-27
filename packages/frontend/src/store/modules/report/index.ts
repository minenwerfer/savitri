import { Module } from 'frontend/store/module'
import { useFile } from 'frontend/composables'

const initialItemState = {
  limit: 150
}

export class ReportModule extends Module<{}, {}> {
  constructor() {
    super('report', {}, initialItemState)
  }

  actions() {
    return {
      download: ({}, { payload }: any) => {
        window.open(useFile(payload.filters.file).link)
      }
    }
  }
}
