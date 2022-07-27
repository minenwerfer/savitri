import { Module } from '../module'
// import { useFile } from '../../composables'

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
        // window.open(useFile(payload.filters.file).link)
      }
    }
  }
}
