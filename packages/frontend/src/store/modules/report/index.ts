import { Module, SV_API_URL } from 'frontend/store/module'

export class ReportModule extends Module<{}, {}> {
  constructor() {
    super('report', {}, {})
  }

  actions() {
    return {
      download: ({}, { payload }: any) => {
        window.open(SV_API_URL + `/download/${payload.filters.file._id}/download`)
      }
    }
  }
}
